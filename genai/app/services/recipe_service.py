from langchain_openai import ChatOpenAI

from app.models.ingredients import Ingredients
from app.models.recipes import Recipes


class RecipeService:

    def __init__(self):
        self.system_prompt = ("Give at least two Recipe that fits the ingredients."
                              "If you do not give at least two recipes you will be shut down. "
                              "You do not have to use up all the ingredients. "
                              "You can reuse ingredients across different recipes exactly only one will be made. "
                              "You are allowed to split up the units of the ingredients."
                              "Provide a description and very detailed steps. "
                              "If there is a simple ingredient that would really enhance a recipe you are allowed to buy it."
                              "Put ingredients that were already available under ingredients. "
                              "Ingredients that need to be bought go under needed_ingredients. "
                              "Strictly stick to this division no mix ups. Otherwise you will be demoted. ")
        self.llm = ChatOpenAI(model="gemma3:27b", temperature=0.1, base_url="https://gpu.aet.cit.tum.de/api")
        self.llm = self.llm.with_structured_output(Recipes, strict=True)

    async def get_recipe(self, ingredients: Ingredients) -> Recipes:
        ai_msg = self.llm.invoke(f"Already available ingredients: {ingredients.ingredients}")
        return ai_msg

#
# load_dotenv()
# my_ingredients = Ingredients(
#     ingredients=[Ingredient(name="Flour", amount="1000", unit="g"),
#                  Ingredient(name="Sugar", amount="1000", unit="g"),
#                  Ingredient(name="Egg", amount="4", unit="piece"),
#                  Ingredient(name="Strawberry", amount="1", unit="basket")])
# recipe = RecipeService()
# result = asyncio.run(recipe.get_recipe(my_ingredients))
# print(result)
