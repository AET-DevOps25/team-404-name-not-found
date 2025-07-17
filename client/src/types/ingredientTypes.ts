import { AvailabilityScore } from "@/types/availabilityScore";

export type Unit = "pcs" | "ml" | "g";

export interface Ingredient {
    name: string;
    quantity: number;
    unit: Unit;
}

export interface IngredientWithAvailability extends Ingredient {
    availabilityScore: AvailabilityScore;
}

export interface IngredientWithId extends Ingredient {
    id: string;
}

export interface IngredientWithUnitMismatch extends Ingredient {
    unitMismatch: boolean; // Indicates if the unit of this ingredient does not match the unit in the recipe
}
