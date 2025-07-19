import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import RecipeSidebar from "./RecipeSidebar";
import { RecipeWithAvailabilityAndId } from "@/types/recipeTypes";

const mockRecipes: RecipeWithAvailabilityAndId[] = [
    {
        id: "1",
        title: "Test Recipe",
        description: "A test recipe description.",
        cookingTime: 10,
        difficulty: "easy",
        ingredients: [],
        instructions: ["Step 1", "Step 2"],
        availabilityScore: "good",
    },
];

vi.mock("@/hooks/useHoveredElementId", () => ({
    useHoveredElementId: () => ({
        hoveredId: null,
        setHoveredId: vi.fn(),
        reevaluateHoveredId: vi.fn(),
    }),
}));
vi.mock("./RecipesLoadingSpinner", () => ({
    default: () => <div data-testid="recipes-loading-spinner" />,
}));

describe("RecipeSidebar", () => {
    it("shows a loading indicator when loading=true", () => {
        render(
            <RecipeSidebar loading={true} recipes={[]} onRecipeSelect={vi.fn()}>
                <div>Children</div>
            </RecipeSidebar>
        );
        expect(screen.getByTestId("recipes-loading-spinner")).toBeInTheDocument();
    });

    it("shows recipes and reacts to click", () => {
        const onRecipeSelect = vi.fn();
        render(
            <RecipeSidebar loading={false} recipes={mockRecipes} onRecipeSelect={onRecipeSelect}>
                <div>Children</div>
            </RecipeSidebar>
        );
        expect(screen.getByText("Test Recipe")).toBeInTheDocument();
        fireEvent.click(screen.getByText("Test Recipe"));
        expect(onRecipeSelect).toHaveBeenCalledWith(mockRecipes[0]);
    });
});
