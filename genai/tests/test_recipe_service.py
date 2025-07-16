import unittest
from unittest.mock import AsyncMock, MagicMock, patch
import pytest
from dotenv import load_dotenv
from fastapi import HTTPException

from app.models.ingredient import Ingredient, Unit
from app.models.ingredients import Ingredients
from app.models.recipe import Recipe, Difficulty
from app.models.recipes import Recipes
from app.services.recipe_service import RecipeService


class TestRecipeService(unittest.TestCase):

    def setUp(self):
        load_dotenv()

        self.recipe_service = RecipeService()
        # Mock the LLM to avoid actual API calls
        self.recipe_service.llm = MagicMock()

        # Test data
        self.test_ingredients = Ingredients(
            ingredients=[
                Ingredient(name="Apple", amount=2, unit=Unit.PCS),
                Ingredient(name="Milk", amount=500, unit=Unit.ML),
                Ingredient(name="Flour", amount=300, unit=Unit.G),
            ]
        )

        self.test_recipe = Recipe(
            title="Apple Pancakes",
            description="Delicious apple pancakes",
            difficulty=Difficulty.EASY,
            cook_time=20,
            ingredients=[
                Ingredient(name="Apple", amount=1, unit=Unit.PCS),
                Ingredient(name="Milk", amount=200, unit=Unit.ML),
                Ingredient(name="Flour", amount=150, unit=Unit.G),
            ],
            needed_ingredients=[],
            steps=["Mix ingredients", "Cook pancakes"],
        )

        self.test_exploratory_recipe = Recipe(
            title="Apple Cake",
            description="Tasty apple cake with cinnamon",
            difficulty=Difficulty.MEDIUM,
            cook_time=45,
            ingredients=[
                Ingredient(name="Apple", amount=2, unit=Unit.PCS),
                Ingredient(name="Flour", amount=200, unit=Unit.G),
            ],
            needed_ingredients=[
                Ingredient(name="Cinnamon", amount=5, unit=Unit.G),
                Ingredient(name="Sugar", amount=50, unit=Unit.G),
            ],
            steps=["Mix ingredients", "Bake in oven"],
        )

    @patch("app.services.recipe_service.ChatOpenAI")
    def test_init(self, mock_chat_openai):
        # Test that the ChatOpenAI is initialized correctly
        RecipeService()
        mock_chat_openai.assert_called_once()

    @pytest.mark.asyncio
    async def test_get_recipe_matching_success(self):
        # Configure the mock to return our test recipe
        self.recipe_service.llm.invoke = AsyncMock(return_value=self.test_recipe)

        # Call the method
        result = await self.recipe_service.get_recipe_matching(
            [], self.test_ingredients
        )

        # Assert results
        self.assertEqual(result, self.test_recipe)
        self.assertEqual(result.title, "Apple Pancakes")

    @pytest.mark.asyncio
    async def test_get_recipe_matching_validation_error(self):
        # Create an invalid recipe that would fail validation
        invalid_recipe = Recipe(
            title="Invalid Recipe",
            description="Recipe with ingredients not in the list",
            ingredients=[
                Ingredient(
                    name="Banana", amount=1, unit=Unit.PCS
                ),  # Not in available ingredients
            ],
            needed_ingredients=[],
            steps=["Step 1", "Step 2"],
        )

        # Configure mock to return invalid recipe first, then valid recipe
        self.recipe_service.llm.invoke = AsyncMock(
            side_effect=[invalid_recipe, self.test_recipe]
        )

        # Call method
        result = await self.recipe_service.get_recipe_matching(
            [], self.test_ingredients
        )

        # It should retry and return the valid recipe on second attempt
        self.assertEqual(result, self.test_recipe)
        self.assertEqual(self.recipe_service.llm.invoke.call_count, 2)

    @pytest.mark.asyncio
    async def test_get_recipe_matching_max_retries(self):
        # Create an invalid recipe
        invalid_recipe = Recipe(
            title="Invalid Recipe",
            description="Recipe with ingredients not in the list",
            ingredients=[
                Ingredient(
                    name="Banana", amount=1, unit=Unit.PCS
                ),  # Not in available ingredients
            ],
            needed_ingredients=[],
            steps=["Step 1", "Step 2"],
        )

        # Configure mock to always return invalid recipe
        self.recipe_service.llm.invoke = AsyncMock(return_value=invalid_recipe)

        # Call method - should raise HTTPException after 3 attempts
        with self.assertRaises(HTTPException) as context:
            await self.recipe_service.get_recipe_matching([], self.test_ingredients)

        # Verify exception details
        self.assertEqual(context.exception.status_code, 500)
        self.assertEqual(self.recipe_service.llm.invoke.call_count, 3)

    @pytest.mark.asyncio
    async def test_get_recipes_matching(self):
        # Create additional recipes for testing multiple recipes
        recipe2 = Recipe(
            title="Milk Pudding",
            description="Simple milk pudding",
            difficulty=Difficulty.EASY,
            cook_time=30,
            ingredients=[
                Ingredient(name="Milk", amount=300, unit=Unit.ML),
                Ingredient(name="Flour", amount=50, unit=Unit.G),
            ],
            needed_ingredients=[],
            steps=["Mix and heat ingredients", "Cool down"],
        )

        # Configure mock to return different recipes for each call
        self.recipe_service.llm.invoke = AsyncMock(
            side_effect=[self.test_recipe, recipe2]
        )

        # Call method to get 2 recipes
        result = await self.recipe_service.get_recipes_matching(
            2, self.test_ingredients
        )

        # Verify results
        self.assertIsInstance(result, Recipes)
        self.assertEqual(len(result.recipes), 2)
        self.assertEqual(result.recipes[0].title, "Apple Pancakes")
        self.assertEqual(result.recipes[1].title, "Milk Pudding")

    @pytest.mark.asyncio
    async def test_get_recipe_exploratory(self):
        # Configure mock to return exploratory recipe
        self.recipe_service.llm.invoke = AsyncMock(
            return_value=self.test_exploratory_recipe
        )

        # Call method
        result = await self.recipe_service.get_recipe_exploratory(
            [], self.test_ingredients
        )

        # Verify results - exploratory recipes can have needed_ingredients
        self.assertEqual(result, self.test_exploratory_recipe)
        self.assertEqual(len(result.needed_ingredients), 2)
        self.assertEqual(result.needed_ingredients[0].name, "Cinnamon")

    @pytest.mark.asyncio
    async def test_get_recipes_exploratory(self):
        # Create additional exploratory recipe
        exploratory_recipe2 = Recipe(
            title="Milk Shake",
            description="Refreshing milk shake",
            difficulty=Difficulty.EASY,
            cook_time=10,
            ingredients=[Ingredient(name="Milk", amount=400, unit=Unit.ML)],
            needed_ingredients=[
                Ingredient(name="Vanilla Extract", amount=5, unit=Unit.ML)
            ],
            steps=["Blend ingredients", "Serve cold"],
        )

        # Configure mock to return different recipes
        self.recipe_service.llm.invoke = AsyncMock(
            side_effect=[self.test_exploratory_recipe, exploratory_recipe2]
        )

        # Call method
        result = await self.recipe_service.get_recipes_exploratory(
            2, self.test_ingredients
        )

        # Verify results
        self.assertIsInstance(result, Recipes)
        self.assertEqual(len(result.recipes), 2)
        self.assertEqual(result.recipes[0].title, "Apple Cake")
        self.assertEqual(result.recipes[1].title, "Milk Shake")

    def test_validate_recipe_uses_only_available_ingredients(self):
        # Valid recipe - all ingredients available and amounts are sufficient
        valid = self.recipe_service._RecipeService__validate_recipe_uses_only_available_ingredients(
            self.test_recipe, self.test_ingredients
        )
        self.assertTrue(valid)

        # Invalid recipe - ingredient not in list
        invalid_recipe = Recipe(
            title="Invalid Recipe",
            description="Recipe with unavailable ingredient",
            ingredients=[Ingredient(name="Banana", amount=1, unit=Unit.PCS)],
            needed_ingredients=[],
            steps=["Step 1"],
        )
        invalid = self.recipe_service._RecipeService__validate_recipe_uses_only_available_ingredients(
            invalid_recipe, self.test_ingredients
        )
        self.assertFalse(invalid)

        # Invalid recipe - amount too high
        invalid_recipe2 = Recipe(
            title="Invalid Recipe 2",
            description="Recipe with too much of an ingredient",
            ingredients=[
                Ingredient(name="Apple", amount=5, unit=Unit.PCS)
            ],  # Only 2 available
            needed_ingredients=[],
            steps=["Step 1"],
        )
        invalid2 = self.recipe_service._RecipeService__validate_recipe_uses_only_available_ingredients(
            invalid_recipe2, self.test_ingredients
        )
        self.assertFalse(invalid2)

        # Invalid recipe - different unit
        invalid_recipe3 = Recipe(
            title="Invalid Recipe 3",
            description="Recipe with wrong unit",
            ingredients=[Ingredient(name="Apple", amount=1, unit=Unit.ML)],
            needed_ingredients=[],
            steps=["Step 1"],
        )
        invalid3 = self.recipe_service._RecipeService__validate_recipe_uses_only_available_ingredients(
            invalid_recipe3, self.test_ingredients
        )
        self.assertFalse(invalid3)

        # Invalid recipe - has needed ingredients
        invalid_recipe4 = Recipe(
            title="Invalid Recipe 4",
            description="Recipe with needed ingredients",
            ingredients=[Ingredient(name="Apple", amount=1, unit=Unit.PCS)],
            needed_ingredients=[Ingredient(name="Sugar", amount=10, unit=Unit.G)],
            steps=["Step 1"],
        )
        invalid4 = self.recipe_service._RecipeService__validate_recipe_uses_only_available_ingredients(
            invalid_recipe4, self.test_ingredients
        )
        self.assertFalse(invalid4)


if __name__ == "__main__":
    unittest.main()
