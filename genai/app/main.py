from fastapi import FastAPI, Path, Body
from prometheus_fastapi_instrumentator import Instrumentator
from dotenv import load_dotenv

from app.models.recipes import Recipes
from app.services.image_service import ImageService
from app.services.recipe_service import RecipeService
from app.models.ingredients import Ingredients

load_dotenv()

app = FastAPI(root_path="/api/genai/v1")
# /metrics endpoint
Instrumentator().instrument(app).expose(app)

recipe_service = RecipeService()
image_service = ImageService()


@app.get("/health", summary="Health Check", description="Health Check")
def health():
    return {"status": "healthy"}


@app.post(
    "/recipe/matching",
    response_model=Recipes,
    summary="Generate one matching recipe",
    description=(
        "Generates one matching recipe that uses no more than the available ingredients. "
    ),
)
async def generate_recipe_matching(
    ingredients: Ingredients = Body(description="Available ingredients"),
):
    return await generate_recipes_matching(1, ingredients)


@app.post(
    "/recipe/matching/{num_recipes}",
    response_model=Recipes,
    summary="Generate number of matching recipes",
    description=(
        "Generates multiple matching recipes. "
        "That are all different and use no more than the available ingredients."
    ),
)
async def generate_recipes_matching(
    num_recipes: int = Path(description="Number of recipes to return"),
    ingredients: Ingredients = Body(description="Available ingredients"),
):
    recipes = await recipe_service.get_recipes_matching(num_recipes, ingredients)
    return recipes


@app.post(
    "/recipe/exploratory",
    response_model=Recipes,
    summary="Generate one exploratory recipe",
    description=(
        "An exploratory recipes can use more than the available ingredients as well as new ones. "
    ),
)
async def generate_recipe_exploratory(
    ingredients: Ingredients = Body(description="Available ingredients"),
):
    return await generate_recipes_exploratory(1, ingredients)


@app.post(
    "/recipe/exploratory/{num_recipes}",
    response_model=Recipes,
    summary="Generate number of exploratory recipes",
    description=(
        "An exploratory recipes can use more than the available ingredients as well as new ones. "
        "All returned recipes are different. "
    ),
)
async def generate_recipes_exploratory(
    num_recipes: int = Path(description="Number of recipes to return"),
    ingredients: Ingredients = Body(description="Available ingredients"),
):
    recipes = await recipe_service.get_recipes_exploratory(num_recipes, ingredients)
    return recipes


@app.post(
    "/image/analyze",
    response_model=Ingredients,
    summary="Finds ingredients in fridge image",
    description=(
        "Takes an base64 encoded image of a fridge (preferably open). "
        "Tries to find as many and as accurate ingredients as possible from the image. "
    ),
)
async def analyze_fridge(
    image_base64: str = Body(description="Image as base64 string"),
):
    ingredients = await image_service.analyze_fridge(image_base64)
    return ingredients
