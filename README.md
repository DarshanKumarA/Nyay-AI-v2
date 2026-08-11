# ⚖️ Nyay AI (न्याय AI) v2

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.116-blue?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react&logoColor=white)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

An AI-powered intelligence engine designed to accelerate justice in the Indian legal system by transforming unstructured case files into interactive, intelligent briefs.

---

## 📌 About The Project

Nyay AI addresses a critical challenge in the judicial system: the overwhelming backlog of pending cases due to manual, document-heavy processes. This application serves as a secure intelligence engine for legal professionals, ingesting complex case files (PDFs & TXT) and converting them into a single, dynamic, and interactive "Intelligent Brief."

Inspired by modern AI research and legal tech innovation, this project brings unprecedented speed and clarity to case analysis, legal drafting, precedent search, and contradiction detection.

---

## ✨ Key Features

* 🚀 **Multi-Provider LLM Engine**: Powered by **OpenRouter API** (supporting `meta-llama/llama-3.3-70b-instruct` and `openai/gpt-4o`) with seamless fallback to **Google Gemini** (`gemini-2.5-flash`).
* 📜 **Intelligent Brief Generation**: Automatically generates concise multi-layered summaries, key arguments, and involved parties from uploaded case documents.
* ✍️ **Automated Legal Drafting**: Instantly drafts legal notices, plaints, and affidavits using facts extracted directly from case files.
* 📅 **Chronological Case Timeline**: Visualizes key case events and dates in an interactive timeline.
* 🔍 **Real-time Precedent Search**: Discovers relevant historical cases and precedent patterns from user case documents using ChromaDB vector search and reciprocal rank fusion.
* ⚡ **Evidentiary Contradiction Detection**: Flags direct conflicts and factual impossibilities across multiple witness statements and exhibit records.
* 💬 **Context-Aware Chat Assistant**: Interactive AI assistant featuring an animated glowing typing indicator and clean Markdown text formatting.
* 🛠️ **Robust JSON Parsing & Syntax Repair**: `parse_json_from_llm` automatically recovers from LLM syntax glitches (missing quotes, unescaped newlines, trailing commas) for 100% reliable API responses.
* 🔒 **Secure Authentication**: Complete JWT-based authentication system with password hashing and user profiles.

---

## 🛠️ Tech Stack

* **Frontend:**
  * [React 19](https://reactjs.org/) with Vite
  * React Router for navigation
  * React Context API for state management
  * Axios for API communication

* **Backend:**
  * [FastAPI](https://fastapi.tiangolo.com/) with Uvicorn
  * [SQLAlchemy](https://www.sqlalchemy.org/) ORM & SQLite
  * [Pydantic](https://pydantic-docs.helpmanual.io/) for data validation
  * JWT (`python-jose`) & `passlib` for authentication

* **AI & NLP:**
  * **OpenRouter API** (Meta Llama 3.3 70B Instruct / OpenAI GPT-4o)
  * **Google Gemini API** (`gemini-2.5-flash`)
  * **Sentence-Transformers** (`all-MiniLM-L6-v2`) for embeddings
  * **ChromaDB** for vector storage & semantic search
  * **PyPDF** for PDF document processing

* **DevOps & Containers:**
  * [Docker](https://www.docker.com/) & Docker Compose
  * Nginx (Reverse Proxy for Frontend container)

---

## 🚀 Getting Started

### Prerequisites
* Git
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Optional, for Docker deployment)
* Node.js (v18+) & Python (v3.11+)

---

### Option 1: Quick Start with Docker (Recommended)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/DarshanKumarA/nyay-ai.git
   cd nyay-ai
   ```

2. **Configure Environment File:**
   Create a `.env` file in the `backend/` directory (see [Environment Variables](#-environment-variables) below).

3. **Build & Run with Docker Compose:**
   ```bash
   docker compose up --build
   ```

4. **Access the Application:**
   * Frontend Web App: `http://localhost:5173`
   * Backend API Documentation: `http://localhost:8000/docs`

---

### Option 2: Manual Installation

#### 1. Setup Backend (`/backend`)

```powershell
# Navigate to backend
cd backend

# Create & activate virtual environment (Windows)
python -m venv venv
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file inside backend/ directory
```

Start the FastAPI server:
```powershell
python -m uvicorn main:app --port 8000 --reload
```
> Backend runs at `http://127.0.0.1:8000`

#### 2. Setup Frontend (`/frontend`)

Open a new terminal window:
```powershell
# Navigate to frontend
cd frontend

# Install NPM dependencies
npm install

# Start Vite dev server
npm run dev
```
> Frontend runs at `http://localhost:5173` (or `http://localhost:5174`)

---

## 🔑 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Security key for JWT token signing
SECRET_KEY="your_super_secret_key_here"

# OpenRouter API Configuration (Recommended)
OPENROUTER_API_KEY="sk-or-v1-your_openrouter_api_key_here"
OPENROUTER_MODEL_NAME="meta-llama/llama-3.3-70b-instruct"

# Google Gemini API Configuration (Fallback)
GEMINI_API_KEY="your_gemini_api_key_here"
GEMINI_MODEL_NAME="gemini-2.5-flash"
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
