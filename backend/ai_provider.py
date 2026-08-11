# backend/ai_provider.py

import json
import re
import requests
import asyncio
from typing import List, Dict, Any, Optional

def parse_json_from_llm(text: str) -> Any:
    """
    Robustly cleans and parses JSON returned by LLM models.
    Handles markdown code blocks, missing quotes around string values,
    missing line-end commas, and trailing commas automatically.
    """
    if not text:
        raise ValueError("Empty response from LLM")
    
    cleaned = text.strip()
    cleaned = re.sub(r'^```(?:json)?\s*', '', cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r'\s*```$', '', cleaned).strip()

    # Extract JSON object or array substring
    match = re.search(r'(\{[\s\S]*\}|\[[\s\S]*\])', cleaned)
    json_str = match.group(1) if match else cleaned

    # Try standard json.loads first (with strict=False for control chars like newlines)
    try:
        return json.loads(json_str, strict=False)
    except json.JSONDecodeError:
        pass

    # Try simple trailing comma fix
    repaired = re.sub(r',(\s*[\}\]])', r'\1', json_str)
    try:
        return json.loads(repaired, strict=False)
    except json.JSONDecodeError:
        pass

    # Advanced line-by-line repair for unquoted strings and missing commas
    raw_lines = json_str.splitlines()
    fixed_lines = []
    
    for i, line in enumerate(raw_lines):
        m = re.match(r'^(\s*"[^"]+":\s*)(.*)$', line)
        if m:
            prefix, val = m.group(1), m.group(2).strip()
            has_comma = val.endswith(',')
            if has_comma:
                val = val[:-1].strip()
            
            # If val is an unquoted string
            if val and not (val.startswith('"') or val.startswith('{') or val.startswith('[') or val in ['true', 'false', 'null'] or re.match(r'^-?\d+(\.\d+)?$', val)):
                val_escaped = val.replace('"', '\\"')
                val = f'"{val_escaped}"'
            
            # Check if next line is a new key and current line needs a comma
            next_line_is_key = False
            if i + 1 < len(raw_lines):
                next_line = raw_lines[i + 1].strip()
                if re.match(r'^"[^"]+":', next_line):
                    next_line_is_key = True
            
            if next_line_is_key or has_comma:
                line_str = f'{prefix}{val},'
            else:
                line_str = f'{prefix}{val}'
            fixed_lines.append(line_str)
        else:
            fixed_lines.append(line)

    repaired_full = "\n".join(fixed_lines)
    repaired_full = re.sub(r',(\s*[\}\]])', r'\1', repaired_full)

    try:
        return json.loads(repaired_full, strict=False)
    except json.JSONDecodeError as e:
        print(f"[REPAIR FAILED]: {e}\nRaw LLM text:\n{text}")
        raise e

class LLMResponse:
    def __init__(self, text: str):
        self.text = text

class OpenRouterChatSession:
    def __init__(self, model: 'OpenRouterModel', history: Optional[List[Dict[str, Any]]] = None):
        self.model = model
        self.messages: List[Dict[str, str]] = []
        if history:
            for item in history:
                role = item.get('role', 'user')
                if role == 'model':
                    role = 'assistant'
                parts = item.get('parts', [])
                content = ""
                if isinstance(parts, list):
                    content = "\n".join([p if isinstance(p, str) else p.get('text', '') for p in parts])
                elif isinstance(parts, str):
                    content = parts
                if content:
                    self.messages.append({'role': role, 'content': content})

    async def send_message_async(self, prompt: str) -> LLMResponse:
        self.messages.append({'role': 'user', 'content': prompt})
        text = await self.model._call_api_async(self.messages)
        self.messages.append({'role': 'assistant', 'content': text})
        return LLMResponse(text=text)

class OpenRouterModel:
    def __init__(self, api_key: str, model_name: str = "meta-llama/llama-3.3-70b-instruct"):
        self.api_key = api_key
        self.model_name = model_name
        self.url = "https://openrouter.ai/api/v1/chat/completions"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://nyay-ai.local",
            "X-Title": "Nyay AI"
        }

    def _call_api_sync(self, messages: List[Dict[str, str]], max_tokens: int = 3500) -> str:
        payload = {
            "model": self.model_name,
            "max_tokens": max_tokens,
            "messages": messages
        }
        try:
            response = requests.post(self.url, headers=self.headers, json=payload, timeout=60)
            if response.status_code != 200:
                print(f"[OpenRouter Error]: {response.status_code} - {response.text}")
                raise Exception(f"OpenRouter API error ({response.status_code}): {response.text}")
            data = response.json()
            choices = data.get("choices", [])
            if choices:
                return choices[0].get("message", {}).get("content", "").strip()
            return ""
        except Exception as e:
            print(f"[OpenRouter Sync Exception]: {e}")
            raise e

    async def _call_api_async(self, messages: List[Dict[str, str]], max_tokens: int = 3500) -> str:
        return await asyncio.to_thread(self._call_api_sync, messages, max_tokens)

    def generate_content(self, prompt: str) -> LLMResponse:
        messages = [{"role": "user", "content": prompt}]
        text = self._call_api_sync(messages)
        return LLMResponse(text=text)

    async def generate_content_async(self, prompt: str) -> LLMResponse:
        messages = [{"role": "user", "content": prompt}]
        text = await self._call_api_async(messages)
        return LLMResponse(text=text)

    def start_chat(self, history: Optional[List[Dict[str, Any]]] = None) -> OpenRouterChatSession:
        return OpenRouterChatSession(self, history=history)
