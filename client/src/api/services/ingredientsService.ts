import { ingredientsClient } from "@/api/fetchClients";
import { Ingredient, IngredientNoId } from "@/types/ingredientTypes";
import { components } from "@/api/ingredients";

type ApiIngredient = components["schemas"]["Ingredient"];

const mapIngredient = (ingredient: ApiIngredient): Ingredient => {
    if (!ingredient.id) {
        throw new Error("Ingredient must have an id");
    }
    return {
        id: ingredient.id,
        name: ingredient.name,
        quantity: ingredient.amount,
        unit: ingredient.unit,
    };
};

class IngredientsService {
    async getAll(): Promise<Ingredient[]> {
        const result = await ingredientsClient.GET("/");

        const errorMessageHeader = "Failed to fetch ingredients";
        if (!result.response.ok) {
            const errorMessage = `${errorMessageHeader}: response is not OK: ${result.response.status} ${result.response.status}`;
            console.error(errorMessage, result.data);
            throw new Error(errorMessage);
        }
        if (!result.data) {
            throw new Error(`${errorMessageHeader}: response has no data`);
        }

        return result.data.map(mapIngredient);
    }

    async getById(id: string): Promise<Ingredient> {
        const result = await ingredientsClient.GET(`/{id}`, {
            params: {
                path: { id: id },
            },
        });

        const errorMessageHeader = `Failed to fetch ingredient with id ${id}`;
        if (!result.response.ok) {
            const errorMessage = `${errorMessageHeader}: response is not OK: ${result.response.status} ${result.response.status}`;
            console.error(errorMessage, result.data);
            throw new Error(errorMessage);
        }
        if (!result.data) {
            throw new Error(`${errorMessageHeader}: response has no data`);
        }

        return mapIngredient(result.data);
    }

    async deleteById(id: string): Promise<void> {
        const result = await ingredientsClient.DELETE(`/{id}`, {
            params: {
                path: { id: id },
            },
        });

        const errorMessageHeader = `Failed to delete ingredient with id ${id}`;
        if (!result.response.ok) {
            const errorMessage = `${errorMessageHeader}: response is not OK: ${result.response.status} ${result.response.status}`;
            console.error(errorMessage, result.data);

            if (result.response.status === 404) {
                throw new Error(`Ingredient not found`);
            }
            throw new Error(errorMessage);
        }
    }

    async updateIngredient(ingredient: Ingredient): Promise<Ingredient> {
        const result = await ingredientsClient.PUT("/", {
            body: {
                id: ingredient.id,
                name: ingredient.name,
                amount: ingredient.quantity,
                unit: ingredient.unit,
            },
        });

        const errorMessageHeader = `Failed to update ingredient with id ${ingredient.id}`;
        if (!result.response.ok) {
            const errorMessage = `${errorMessageHeader}: response is not OK: ${result.response.status} ${result.response.status}`;
            console.error(errorMessage, result.data);
            throw new Error(errorMessage);
        }
        if (!result.data) {
            throw new Error(`${errorMessageHeader}: response has no data`);
        }
        return mapIngredient(result.data);
    }

    async saveIngredients(ingredients: IngredientNoId[]): Promise<Ingredient[]> {
        const result = await ingredientsClient.POST("/", {
            body: ingredients.map((ingredient) => ({
                name: ingredient.name,
                amount: ingredient.quantity,
                unit: ingredient.unit,
            })),
        });

        const errorMessageHeader = "Failed to save ingredients";
        if (!result.response.ok) {
            const errorMessage = `${errorMessageHeader}: response is not OK: ${result.response.status} ${result.response.status}`;
            console.error(errorMessage, result.data);
            throw new Error(errorMessage);
        }
        if (!result.data) {
            throw new Error(`${errorMessageHeader}: response has no data`);
        }

        return result.data.map(mapIngredient);
    }
}

const ingredientsService = new IngredientsService();
export default ingredientsService;
