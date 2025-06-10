from fastapi import FastAPI
from prometheus_fastapi_instrumentator import Instrumentator
from dotenv import load_dotenv

from app.services.recipe_service import RecipeService
from app.models.ingredients import Ingredients

load_dotenv()

app = FastAPI()
# /metrics endpoint
Instrumentator().instrument(app).expose(app)

recipe_service = RecipeService()


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.get("/api/recipe/exploratory")
async def generate_recipe(ingredients: Ingredients):
    recipes = await recipe_service.get_recipe(ingredients)
    return recipes
