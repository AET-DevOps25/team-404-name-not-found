import { IngredientNoId } from "@/types/ingredientTypes";

export type Difficulty = "easy" | "medium" | "advanced";
export type AvailabilityScore = "bad" | "medium" | "good";

export interface Recipe {
    id: string;
    title: string;
    description: string;
    cookingTime: number;
    difficulty: Difficulty;
    ingredients: IngredientNoId[];
    neededIngredients: IngredientNoId[];
    instructions: string[];
    availabilityScore: AvailabilityScore;
}

export type RecipeNoAvailabilityScore = Omit<Recipe, "availabilityScore">;
export type RecipeNoAvailabilityScoreAndId = Omit<Recipe, "availabilityScore" | "id">;
