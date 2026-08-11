# Nyay AI v2

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.116-blue?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react&logoColor=white)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

Legal document analysis and drafting platform for legal case files, witness statements, and evidence records.

---

## About

Nyay AI processes legal case files (PDF and TXT) and generates structured briefs, timelines, precedent matches, and legal drafts. The application provides a full-stack interface and API for legal research and case analysis.

---

## Key Features

* **Multi-Provider LLM Integration**: Uses OpenRouter API (`meta-llama/llama-3.3-70b-instruct`, `openai/gpt-4o`) with fallback to Google Gemini (`gemini-2.5-flash`).
* **Intelligent Brief Summaries**: Extracts core legal arguments, summaries, and involved parties from uploaded case documents.
* **Automated Legal Drafting**: Generates legal notices, plaints, and affidavits using case context.
* **Chronological Case Timelines**: Extracts chronological event sequences with dates from case materials.
* **Precedent Analysis**: Conducts vector similarity search via ChromaDB and reciprocal rank fusion to find matching historical precedents.
* **Contradiction Detection**: Identifies factual conflicts across witness testimonies and exhibit records.
* **Context-Aware Assistant**: Embedded assistant for document querying and app navigation.
* **LLM Output Recovery**: `parse_json_from_llm` automatically parses unquoted strings, raw newlines, and trailing commas from model outputs.
* **Authentication**: JWT authentication with user profiles and password encryption.

---

## Tech Stack

* **Frontend**: React 19, Vite, React Router, Context API, Axios
* **Backend**: FastAPI, Uvicorn, SQLAlchemy, SQLite, Pydantic, Passlib (BCrypt)
* **AI & Retrieval**: OpenRouter API, Google Gemini API, Sentence-Transformers (`all-MiniLM-L6-v2`), ChromaDB, PyPDF
* **DevOps**: Docker, Docker Compose, Nginx

---

## Getting Started

### Prerequisites
* Node.js (v18+)
* Python (v3.11+)
* Docker & Docker Compose (Optional)

---

### Option 1: Running with Docker

1. **Clone the repository:**
   ```bash
   git clone https://github.com/DarshanKumarA/nyay-ai.git
   cd nyay-ai
   ```

2. **Configure Environment:**
   Create `.env` in `backend/` directory (see [Environment Variables](#environment-variables)).

3. **Start Containers:**
   ```bash
   docker compose up --build
   ```

   * Frontend: `http://localhost:5173`
   * API Docs: `http://localhost:8000/docs`

---

### Option 2: Manual Setup

#### 1. Backend Setup

```powershell
cd backend

# Create virtual environment
python -m venv venv
.\venv\Scripts\activate

# Install requirements
pip install -r requirements.txt
```

Run backend server:
```powershell
python -m uvicorn main:app --port 8000 --reload
```
Server runs at `http://127.0.0.1:8000`

#### 2. Frontend Setup

In a second terminal window:
```powershell
cd frontend
npm install
npm run dev
```
Client runs at `http://localhost:5173`

---

## Environment Variables

Create `.env` inside `backend/`:

```env
# JWT Secret Key
SECRET_KEY="your_super_secret_key_here"

# OpenRouter API (Primary)
OPENROUTER_API_KEY="sk-or-v1-your_openrouter_api_key_here"
OPENROUTER_MODEL_NAME="meta-llama/llama-3.3-70b-instruct"

# Google Gemini API (Fallback)
GEMINI_API_KEY="your_gemini_api_key_here"
GEMINI_MODEL_NAME="gemini-2.5-flash"
```

---

## License

Distributed under the MIT License. See `LICENSE` for details.
