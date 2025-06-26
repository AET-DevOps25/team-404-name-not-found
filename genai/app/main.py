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

@app.post("/api/recipe/matching")
async def generate_recipe_matching(ingredients: Ingredients):
    return await generate_recipe_matching(1, ingredients)

@app.post("/api/recipe/matching/{num_recipes}")
async def generate_recipe_matching(num_recipes: int, ingredients: Ingredients):
    recipes = await recipe_service.get_recipes_matching(num_recipes, ingredients)
    return recipes

@app.post("/api/recipe/exploratory")
async def generate_recipe_exploratory(ingredients: Ingredients):
    return await generate_recipe_exploratory(1, ingredients)

@app.post("/api/recipe/exploratory/{num_recipes}")
async def generate_recipe_exploratory(num_recipes: int, ingredients: Ingredients):
    recipes = await recipe_service.get_recipes_exploratory(num_recipes, ingredients)
    return recipes
