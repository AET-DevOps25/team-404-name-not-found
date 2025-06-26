from pydantic import BaseModel, Field

from app.models.recipe import Recipe


class Recipes(BaseModel):
    recipes: list[Recipe] = Field(description="List of recipes")
