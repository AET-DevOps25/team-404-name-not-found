from fastapi import FastAPI
from dotenv import load_dotenv

from app.services.recipe_service import RecipeService
from app.models.ingredients import Ingredients

load_dotenv()

app = FastAPI()

recipe_service = RecipeService()


@app.get("/")
def root():
    return {"Hello": "World"}


@app.get("/api/recipe")
async def generate_recipe(ingredients: Ingredients):
    recipe = await recipe_service.get_recipe(ingredients)
    return {"recipe": recipe}
