from enum import Enum

from pydantic import BaseModel, Field


class Unit(Enum):
    PCS = "pcs"
    ML = "ml"
    L = "l"
    G = "g"
    KG = "kg"


class Ingredient(BaseModel):
    name: str = Field(description="Name of ingredient")
    amount: int = Field(description="Amount of ingredient")
    unit: Unit = Field(description="Unit of amount")
