# 🧑‍🍳 What's In My Fridge GenAI Service

Microservice for the "What's In My Fridge" project! 🚀

---

## 📚 Used Libraries & Frameworks

- **Python 3.11+**
- **FastAPI** for developing modern, asynchronous REST APIs
- **Prometheus FastAPI Instrumentator** for metrics and monitoring
- **Pydantic** for data validation and serialization
- **Langchain** for interacting with LLM Service and RAG Service

---

## 🔍 Overview

### 📦 Project Structure

- `app/` – Contains the entire source code of the GenAI service
  - `main.py` – Entry point of the FastAPI application, defines the API endpoints
  - `models/` – Pydantic models for recipes, ingredients, and requests/responses
  - `services/` – Contains the service logic for RAG, recipes, and image recognition
  - `utils/` – Utility functions, e.g., for Prometheus metrics
- `tests/` – Tests for the service logic

---

## 🏗️ Architecture & Security

The GenAI functionality is provided by a FastAPI-based microservice that runs independently. All features are exposed via REST endpoints **without authentication**, as the GenAI microservice is only used internally within the cluster and is not directly user-facing.

---

## 🛠️ Important Commands

- `fastapi run app/main.py` – Starts the development server with hot-reload on port 8000
- `pytest` – Runs the tests
- `docker build -t genai-service .` – Builds the Docker image
- `docker run -p 8000:8000 genai-service` – Starts the service in a container

---

## ⚙️ Important Environment Variables

- `OPENAI_API_KEY` – Api-Key for OpenAI compatible LLM Service
- `OPENAI_API_BASE` – Base URL for the OpenAI compatible LLM Service

---

## ✨ Features

- **Recipe Generation**: 
  - Uses the department(Applied Education Technologies) provided Gemma3 LLM (via LangChain) to generate recipes.
  - `/recipe/matching` endpoint generates recipes strictly matching provided ingredients.
  - `/recipe/exploratory` endpoint generates recipes based on available ingredients and adds extra ingredients if necessary.
  - For every generated recipe, the RAG service is called to enable later retrieval in search.
- **RAG Service (Recipe Search)**: 
  - `/recipe/search` endpoint performs similarity search on all previously generated recipes.
  - Relies on an embedding service (also running in the cluster/docker) and a local pgvector database to store embeddings.
  - Uses LangChain for communication with pgvector and embeddings.
  - Retrieves full recipes found through metadata.
- **Image Analysis**: 
  - `/image/analyze` endpoint processes images encoded as base64 strings.
  - Images are provided to the Gemma3 LLM with instructions to describe all visible ingredients and their quantities.
  - Communication is handled via LangChain.
- **Prometheus Metrics**: `/metrics` endpoint for monitoring and observability

The complete API specification is documented in [the genai openapi.json](./openapi.json).

---

## 🧑‍💻 Rationale & Design Decisions

- Exclusively uses LangChain for all interactions with the LLM and RAG services to allow for easy switching of the underlying backends
- Use local pgvector db and local embeddings service to avoid external dependencies and allow for fast initial development
- Use multimodal capabilities of the Gemma3 LLM to analyze images and extract ingredients because of sufficient performance and no required training

---
