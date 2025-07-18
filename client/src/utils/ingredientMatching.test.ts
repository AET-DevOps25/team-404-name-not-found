import { describe, it, expect, vi } from "vitest";
import { getBestMatchingIngredient } from "@/utils/ingredientMatching";
import { Ingredient, IngredientWithId } from "@/types/ingredientTypes";

vi.mock("string-similarity", () => ({
    default: {
        levenshtein: {
            similarity: (a: string, b: string) => {
                if (a === b) return 1;
                if (a[0] === b[0]) return 0.9;
                return 0.5;
            },
        },
    },
}));

describe("getBestMatchingIngredient", () => {
    const ingredients: IngredientWithId[] = [
        { id: "1", name: "Tomato", quantity: 2, unit: "pcs" },
        { id: "2", name: "Tomatoes", quantity: 3, unit: "pcs" },
        { id: "3", name: "Potato", quantity: 5, unit: "g" },
    ];

    it("finds exact match", () => {
        const ingredient: Ingredient = { name: "Tomato", quantity: 1, unit: "pcs" };
        const result = getBestMatchingIngredient(ingredient, ingredients);
        expect(result?.id).toBe("1");
    });

    it("finds best similar match", () => {
        const ingredient: Ingredient = { name: "Tomatoes", quantity: 1, unit: "pcs" };
        const result = getBestMatchingIngredient(ingredient, ingredients);
        expect(result?.id).toBe("2");
    });

    it("returns null for low similarity", () => {
        const ingredient: Ingredient = { name: "Apple", quantity: 1, unit: "pcs" };
        const result = getBestMatchingIngredient(ingredient, ingredients);
        expect(result).toBeNull();
    });

    it("prefers larger quantity for same score", () => {
        const ingredient: Ingredient = { name: "Tomatoes", quantity: 1, unit: "pcs" };
        const result = getBestMatchingIngredient(ingredient, ingredients);
        expect(result?.quantity).toBe(3);
    });
});
