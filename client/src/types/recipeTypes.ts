import { IngredientNoId } from "@/types/ingredientTypes";
import { AvailabilityScore } from "@/types/availabilityScore";

export type Difficulty = "easy" | "medium" | "advanced";

export interface Recipe {
    id: string;
    title: string;
    description: string;
    cookingTime: number;
    difficulty: Difficulty;
    ingredients: IngredientNoId[];
    instructions: string[];
    availabilityScore: AvailabilityScore;
}

export type RecipeNoAvailabilityScore = Omit<Recipe, "availabilityScore">;
export type RecipeNoAvailabilityScoreAndId = Omit<Recipe, "availabilityScore" | "id">;
