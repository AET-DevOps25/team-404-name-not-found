import { ingredientsClient } from "@/api/fetchClients";
import { Ingredient } from "@/types/ingredientTypes";

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

        return result.data.map((ingredient) => ({
            id: ingredient.id,
            name: ingredient.name,
            quantity: ingredient.amount,
            unit: ingredient.unit,
        }));
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

        return {
            id: result.data.id,
            name: result.data.name,
            quantity: result.data.amount,
            unit: result.data.unit,
        };
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
        return {
            id: result.data.id,
            name: result.data.name,
            quantity: result.data.amount,
            unit: result.data.unit,
        };
    }

    async saveIngredients(ingredients: Ingredient[]): Promise<Ingredient[]> {
        const result = await ingredientsClient.POST("/", {
            body: ingredients.map((ingredient) => ({
                id: ingredient.id,
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

        return result.data.map((ingredient) => ({
            id: ingredient.id,
            name: ingredient.name,
            quantity: ingredient.amount,
            unit: ingredient.unit,
        }));
    }
}

const ingredientsService = new IngredientsService();
export default ingredientsService;
