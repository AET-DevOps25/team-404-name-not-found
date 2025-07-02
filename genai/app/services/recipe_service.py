import logging

from fastapi import HTTPException, status
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_openai import ChatOpenAI

from app.models.ingredients import Ingredients
from app.models.recipe import Recipe
from app.models.recipes import Recipes

logger = logging.getLogger(__name__)


class RecipeService:

    def __init__(self):
        self.llm = ChatOpenAI(model="gemma3:27b", temperature=0.1)
        self.llm = self.llm.with_structured_output(Recipe, strict=True)

    async def get_recipes_matching(self, num_recipes: int, ingredients: Ingredients):
        first_recipe: Recipe = await self.get_recipe_matching([], ingredients)
        recipes: list[Recipe] = [first_recipe]
        recipe_titles: list[str] = [first_recipe.title]

        for _ in range(num_recipes - 1):
            new_recipe: Recipe = await self.get_recipe_matching(
                recipe_titles, ingredients
            )
            recipes.append(new_recipe)
            recipe_titles.append(new_recipe.title)

        return Recipes(recipes=recipes)

    async def get_recipe_matching(
        self, already_generated: list[str], ingredients: Ingredients, retries: int = 0
    ) -> Recipe:
        messages = [
            SystemMessage(
                "Give one recipe that uses only the ingredients. "
                "You do not have to use up all the amount of the ingredients. "
                "You are allowed to split up the units of the ingredients. "
                "Provide a description and very detailed steps. "
                "You are not allowed to use any other ingredients than the available ingredients. "
                "Put ingredients that were already available under ingredients. "
                "Ingredients that need to be bought go under needed_ingredients. "
                "Do not put anything there. "
                "You are not allowed to buy additional ingredients. "
                "Strictly stick to this division no mix ups. "
                f"Under no circumstances are you allowed to generate one of these recipes {already_generated}"
            ),
            HumanMessage(f"Available ingredients {ingredients}"),
        ]

        generated_recipe: Recipe = self.llm.invoke(messages)
        if self.__validate_recipe_uses_only_available_ingredients(
            generated_recipe, ingredients
        ):
            return generated_recipe
        else:
            if retries < 2:
                logger.warning(f"Validation error retry number {retries}")
                return await self.get_recipe_matching(
                    already_generated, ingredients, retries + 1
                )
            else:
                # todo change, works but naja
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="LLM was not able to generate matching recipe. Try the exploratory endpoint",
                )

    async def get_recipes_exploratory(self, num_recipes: int, ingredients: Ingredients):
        first_recipe: Recipe = await self.get_recipe_exploratory([], ingredients)
        recipes: list[Recipe] = [first_recipe]
        recipe_titles: list[str] = [first_recipe.title]

        for _ in range(num_recipes - 1):
            new_recipe: Recipe = await self.get_recipe_exploratory(
                recipe_titles, ingredients
            )
            recipes.append(new_recipe)
            recipe_titles.append(new_recipe.title)

        return Recipes(recipes=recipes)

    async def get_recipe_exploratory(
        self, already_generated: list[str], ingredients: Ingredients
    ) -> Recipe:
        messages = [
            SystemMessage(
                "Give one recipe that uses the ingredients."
                "You do not have to use up all the amount of the ingredients. "
                "You are allowed to split up the units of the ingredients."
                "Provide a description and very detailed steps. "
                "Be a bit creative for an ingredient that would really enhance the recipe you are allowed to buy it."
                "Put ingredients that were given under ingredients. "
                "Ingredients that need to be bought go under needed_ingredients. "
                "Strictly stick to this division no mix ups. "
                f"Under no circumstances are you allowed to generate one of these recipes {already_generated}"
            ),
            HumanMessage(f"Available ingredients {ingredients}"),
        ]

        ai_msg = self.llm.invoke(messages)
        return ai_msg

    def __validate_recipe_uses_only_available_ingredients(
        self, recipe: Recipe, ingredients: Ingredients
    ):
        if len(recipe.needed_ingredients) > 0:
            return False

        available_ingredients = {}
        for ingredient in ingredients.ingredients:
            available_ingredients[ingredient.name] = ingredient

        for recipe_ingredient in recipe.ingredients:
            if not recipe_ingredient.name in available_ingredients:
                return False

            available_ingredient = available_ingredients[recipe_ingredient.name]

            if (
                recipe_ingredient.amount > available_ingredient.amount
                or recipe_ingredient.unit != available_ingredient.unit
            ):
                return False

        return True
