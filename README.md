# ⚖️ Nyay AI (न्याय AI) v2

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.116-blue?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react&logoColor=white)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

An AI-powered intelligence engine designed to accelerate justice in the Indian legal system by transforming unstructured case files into interactive, intelligent briefs.

---

##  About The Project

Nyay AI addresses a critical challenge in the Indian judicial system: the overwhelming backlog of over 47 million pending cases, largely due to a manual, paper-based process. This application serves as a secure intelligence engine for legal professionals, ingesting thousands of pages of legal documents and converting them into a single, dynamic, and interactive "Intelligent Brief."

Inspired by the vision of the Hon'ble Justice D.Y. Chandrachud, Chief Justice of India, this project aims to use modern AI to bring unprecedented speed and clarity to case analysis, ultimately helping to reduce delays and restore faith in the justice system.

##  Key Features

* ✅ **Intelligent Brief Generation**: Automatically generates multi-layered summaries, key arguments, and involved parties from uploaded case files (PDF or TXT).
* ✅ **Automated Legal Drafting**: Instantly creates professional legal drafts (Legal Notices, Plaints, Affidavits) tailored to the specific facts of the uploaded case.
* ✅ **Chronological Case Timeline**: Visualizes key events and dates in an interactive timeline for rapid chronological understanding.
* ✅ **Real-time Precedent Analysis**: Finds the most relevant historical cases from a personal vector database using advanced semantic search.
* ✅ **Evidentiary Cross-Verification**: Flags potential contradictions in evidence across multiple documents for human review.
* ✅ **Interactive Chat Assistant**: A context-aware conversational AI that navigates the app and answers questions about case documents.
* ✅ **AI Personalization**: Uses Reinforcement Learning from Human Feedback (RLHF) to fine-tune the model, improving search results over time.
* ✅ **Secure User Authentication**: A complete user management system with profile settings, secure JWT-based authentication, and password hashing.

## 🛠️ Tech Stack

This project was built using a modern, full-stack architecture.

* **Frontend:**
    * [React](https://reactjs.org/) (with Vite)
    * React Router for navigation
    * React Context for state management
    * Axios for API Communication

* **Backend:**
    * [FastAPI](https://fastapi.tiangolo.com/) (with Uvicorn)
    * [SQLAlchemy](https://www.sqlalchemy.org/) ORM
    * [Pydantic](https://pydantic-docs.helpmanual.io/) for data validation
    * JWT (python-jose) & passlib for authentication

* **DevOps & Infrastructure:**
    * [Docker](https://www.docker.com/) & Docker Compose
    * Nginx (Reverse Proxy)

* **AI & Machine Learning:**
    * [Google Gemini API](https://ai.google.dev/) for generative tasks
    * [Sentence-Transformers](https://www.sbert.net/) for text embeddings
    * [ChromaDB](https://www.trychroma.com/) for vector storage and similarity search
    * [LangChain](https://www.langchain.com/) for text splitting
    * [Spacy](https://spacy.io/) for NLP tasks

## Getting Started

You can run Nyay AI using Docker (Recommended) or manually.

### Prerequisites
* Git
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for Docker method)
* Node.js & Python 3.11 (for Manual method)

### Option 1: Quick Start with Docker (Recommended)

This will set up the Database, Backend, and Frontend automatically.

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/DarshanKumarA/nyay-ai.git](https://github.com/DarshanKumarA/nyay-ai.git)
    cd nyay-ai
    ```

2.  **Configure Environment:**
    * Create a `.env` file in the `/backend` directory (see "Environment Variables" below).

3.  **Run with Docker Compose:**
    ```sh
    docker compose up --build
    ```

4.  **Access the App:**
    * Frontend: `http://localhost:5173`
    * Backend API Docs: `http://localhost:8000/docs`

---

### Option 2: Manual Installation

1.  **Setup the Backend (`/backend`):**
    * Navigate to the backend directory:
        ```sh
        cd backend
        ```
    * Create and activate a Python virtual environment:
        ```sh
        # On Windows
        python -m venv venv
        .\venv\Scripts\activate

        # On macOS / Linux
        python3 -m venv venv
        source venv/bin/activate
        ```
    * Install Python packages:
        ```sh
        pip install -r requirements.txt
        ```
    * Create a `.env` file in the `/backend` directory.
    * Start the server:
        ```sh
        uvicorn main:app --reload
        ```
    > The backend will be running at `http://127.0.0.1:8000`.

2.  **Setup the Frontend (`/frontend`):**
    * Open a **new terminal** and navigate to the frontend directory:
        ```sh
        cd frontend
        ```
    * Install NPM packages:
        ```sh
        npm install
        ```
    * Start the client:
        ```sh
        npm run dev
        ```
    > The frontend will be running at `http://localhost:5173`.

## 🔑 Environment Variables

You need to create a `.env` file in the `backend/` directory for the project to run.

**Backend (`/backend/.env`):**
```sh
# A strong, random string used for signing JWTs
SECRET_KEY="your_super_secret_key_here"

# Your API key from Google AI Studio
GEMINI_API_KEY="your_gemini_api_key_here"