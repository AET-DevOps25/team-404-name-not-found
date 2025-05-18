from pydantic import BaseModel


class Ingredients(BaseModel):
    ingredients: list[str]
