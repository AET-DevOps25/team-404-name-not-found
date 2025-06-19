import { Ingredient } from "@/types/ingredientTypes.ts";

export interface Recipe {
    id: string;
    title: string;
    description: string;
    image: string;
    cookTime: number;
    difficulty: "Easy" | "Medium" | "Hard";
    ingredients: Ingredient[];
    instructions: string[];
    availabilityScore: "red" | "yellow" | "green";
}
