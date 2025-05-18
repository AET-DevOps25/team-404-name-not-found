from typing import List
from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage

from app.models.ingredients import Ingredients


class RecipeService:

    def __init__(self):
        self.system_prompt = "Give a recipe that fits the ingredients."
        self.llm = ChatOpenAI(model="gpt-4o", temperature=0.2)

    async def get_recipe(self, ingredients: Ingredients) -> str:
        messages: List = [
            SystemMessage(content=self.system_prompt),
            HumanMessage(content=f"Ingredients: {ingredients.ingredients}"),
        ]
        ai_msg = self.llm.invoke(messages)
        return ai_msg.content
