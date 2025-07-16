import { Ingredient } from "@/types/ingredientTypes";
import { AvailabilityScore } from "@/types/availabilityScore";

export type Difficulty = "easy" | "medium" | "advanced";

export interface Recipe {
    title: string;
    description: string;
    cookingTime: number;
    difficulty: Difficulty;
    ingredients: Ingredient[];
    instructions: string[];
}

export interface RecipeWithId extends Recipe {
    id: string;
}

export interface RecipeWithAvailabilityAndId extends RecipeWithId {
    availabilityScore: AvailabilityScore;
}
