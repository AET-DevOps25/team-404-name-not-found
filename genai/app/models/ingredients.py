from pydantic import BaseModel
from app.models.ingredient import Ingredient


class Ingredients(BaseModel):
    ingredients: list[Ingredient]
