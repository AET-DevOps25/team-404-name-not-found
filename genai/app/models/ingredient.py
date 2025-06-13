from pydantic import BaseModel, Field


class Ingredient(BaseModel):
	name: str = Field(description="Name if ingredient")
	amount: int = Field(description="Amount of ingredient")
	unit: str = Field(description="Unit of amount")
