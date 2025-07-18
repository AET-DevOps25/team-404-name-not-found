from enum import Enum
from pydantic import BaseModel, Field

from app.models.ingredient import Ingredient


class Difficulty(Enum):
    EASY = "easy"
    MEDIUM = "medium"
    ADVANCED = "advanced"


class Recipe(BaseModel):
    title: str = Field(description="Title of recipe")
    description: str = Field(
        description="Description of recipe maximum 80 characters", max_length=80
    )
    difficulty: Difficulty = Field(description="Difficulty of recipe")
    cook_time: int = Field(description="Time needed for recipe")
    ingredients: list[Ingredient] = Field(
        description="List of ingredients needed for recipe already available"
    )
    needed_ingredients: list[Ingredient] = Field(
        description="List of ingredients needed for recipe to buy"
    )
    steps: list[str] = Field(description="List of every step needed for recipe")
