# 🧑‍🍳 What's In My Fridge GenAI Service

Backend service for the "What's In My Fridge" project! 🚀

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
- `tests/` – Unit and integration tests for the service logic

---

## 🛠️ Important Commands

- `fastapi run app/main.py"` – Starts the development server with hot-reload on port 8000
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
  - `/recipe/matching` endpoint generates recipes strictly matching available ingredients
  - `/recipe/exploratory` endpoint generates recipes based on available ingredients also adds extra ingredients if necessary
- **RAG Service**: `/recipe/search` Uses Retrieval-Augmented Generation to search in every generated recipe
- **Image-to-Ingredients**: `/image/scan` endpoint detects ingredients from uploaded images
- **Prometheus Metrics**: `/metrics` endpoint for monitoring and observability

The complete API specification is documented in `genai/openapi.json`.

---


