import { recipesClient } from "@/api/fetchClients";
import { Difficulty, RecipeWithId, Recipe } from "@/types/recipeTypes";
import { Ingredient } from "@/types/ingredientTypes.ts";
import { components } from "@/api/recipes";
import { v4 as uuidv4 } from "uuid";

type ApiRecipe = components["schemas"]["Recipe"];
type ApiIngredient = components["schemas"]["Ingredient"];

const mapToIngredient = (ingredient: ApiIngredient): Ingredient => {
    return {
        name: ingredient.name,
        quantity: ingredient.amount,
        unit: ingredient.unit,
    };
};

const mapToRecipe = (recipe: ApiRecipe): RecipeWithId => {
    const id = recipe.id || uuidv4(); // Generate a temporary ID if not present
    return {
        id: id,
        title: recipe.title,
        description: recipe.description,
        cookingTime: recipe.cookingTime,
        difficulty: recipe.difficulty,
        ingredients: [...recipe.ingredients.map(mapToIngredient), ...recipe.neededIngredients.map(mapToIngredient)],
        instructions: recipe.instructions,
    };
};

const mapToApiIngredient = (ingredient: Ingredient): ApiIngredient => {
    return {
        name: ingredient.name,
        amount: ingredient.quantity,
        unit: ingredient.unit,
    };
};

const mapToApiRecipe = (recipe: Recipe): ApiRecipe => {
    return {
        title: recipe.title,
        description: recipe.description,
        cookingTime: recipe.cookingTime,
        difficulty: recipe.difficulty as Difficulty,
        instructions: recipe.instructions,
        ingredients: recipe.ingredients.map(mapToApiIngredient),
        neededIngredients: [],
    };
};

class RecipesService {
    async getAll(): Promise<RecipeWithId[]> {
        const result = await recipesClient.GET("/");

        const errorMessageHeader = "Failed to fetch recipes";
        if (!result.response.ok) {
            const errorMessage = `${errorMessageHeader}: response is not OK: ${result.response.status} ${result.response.statusText}`;
            console.error(errorMessage, result.data);
            throw new Error(errorMessage);
        }
        if (!result.data) {
            throw new Error(`${errorMessageHeader}: response has no data`);
        }

        return result.data.map(mapToRecipe);
    }

    async save(recipe: Recipe): Promise<RecipeWithId> {
        const apiRecipe = mapToApiRecipe(recipe);
        const result = await recipesClient.POST("/", {
            body: apiRecipe,
        });

        const errorMessageHeader = "Failed to save recipe";
        if (!result.response.ok) {
            const errorMessage = `${errorMessageHeader}: response is not OK: ${result.response.status} ${result.response.statusText}`;
            console.error(errorMessage, result.data);
            throw new Error(errorMessage);
        }
        if (!result.data) {
            throw new Error(`${errorMessageHeader}: response has no data`);
        }

        return mapToRecipe(result.data);
    }

    async deleteById(id: string): Promise<void> {
        const result = await recipesClient.DELETE(`/{id}`, {
            params: {
                path: { id: id },
            },
        });

        const errorMessageHeader = `Failed to delete recipe with id ${id}`;
        if (!result.response.ok) {
            const errorMessage = `${errorMessageHeader}: response is not OK: ${result.response.status} ${result.response.statusText}`;
            console.error(errorMessage, result.data);

            if (result.response.status === 404) {
                throw new Error(`Recipe not found`);
            }
            throw new Error(errorMessage);
        }
    }

    async generateRecipes(numRecipes: number, explore: boolean, ingredients: Ingredient[]): Promise<RecipeWithId[]> {
        const apiIngredients = ingredients.map(mapToApiIngredient);

        const endpoint = explore ? "/ai/explore/{numRecipes}" : "/ai/match/{numRecipes}";

        const result = await recipesClient.POST(endpoint, {
            params: {
                path: { numRecipes: numRecipes },
            },
            body: apiIngredients,
        });

        const errorMessageHeader = "Failed to generate recipes";
        if (!result.response.ok) {
            const errorMessage = `${errorMessageHeader}: response is not OK: ${result.response.status} ${result.response.statusText}`;
            console.error(errorMessage, result.data);
            throw new Error(errorMessage);
        }
        if (!result.data) {
            throw new Error(`${errorMessageHeader}: response has no data`);
        }

        return result.data.map(mapToRecipe);
    }
}

const authService = new RecipesService();
export default authService;
