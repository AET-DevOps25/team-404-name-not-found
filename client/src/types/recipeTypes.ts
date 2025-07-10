import { Ingredient } from "@/types/ingredientTypes";

export interface Recipe {
    id: string;
    title: string;
    description: string;
    image: string;
    cookTime: number;
    difficulty: "Easy" | "Medium" | "Hard";
    ingredients: Ingredient[];
    instructions: string[];
    availabilityScore: "Red" | "Yellow" | "Green";
}
