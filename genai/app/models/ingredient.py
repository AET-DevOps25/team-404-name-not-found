from enum import Enum

from pydantic import BaseModel, Field


class Unit(Enum):
    PCS = "pcs"
    ML = "ml"
    G = "g"


class Ingredient(BaseModel):
    name: str = Field(description="Name of ingredient")
    amount: int = Field(description="Amount of ingredient")
    unit: Unit = Field(description="Unit of amount")
