import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import RecipeSearch from "./RecipeSearch";
import { RecipeWithAvailabilityAndId } from "@/types/recipeTypes";
import { IngredientWithId } from "@/types/ingredientTypes";

const ingredients: IngredientWithId[] = [
    { id: "1", name: "Tomato" },
    { id: "2", name: "Cheese" },
] as IngredientWithId[];

const recipes: RecipeWithAvailabilityAndId[] = [
    {
        id: "r1",
        title: "Tomato Cheese Salad",
        description: "A salad with tomato and cheese.",
        cookingTime: 5,
        difficulty: "easy",
        ingredients: [],
        instructions: ["Mix ingredients"],
        availabilityScore: "good",
    },
];

vi.mock("@/api/services/recipesService", () => ({
    default: {
        searchRecipes: vi.fn((query: string) => {
            if (query.toLowerCase().includes("tomato")) {
                return Promise.resolve(recipes);
            }
            return Promise.resolve([]);
        }),
    },
}));

describe("RecipeSearch", () => {
    it("renders input field", () => {
        render(<RecipeSearch ingredients={ingredients} onResultClicked={vi.fn()} openedRecipe={null} />);
        expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
    });

    it("shows results and handles click", async () => {
        const onResultClicked = vi.fn();
        render(<RecipeSearch ingredients={ingredients} onResultClicked={onResultClicked} openedRecipe={null} />);
        const input = screen.getByPlaceholderText(/search/i);
        fireEvent.change(input, { target: { value: "Tomato" } });
        // Wait for results to appear
        const result = await screen.findByText("Tomato Cheese Salad");
        fireEvent.click(result);
        expect(onResultClicked).toHaveBeenCalledWith(expect.objectContaining({ title: "Tomato Cheese Salad" }));
    });
});
