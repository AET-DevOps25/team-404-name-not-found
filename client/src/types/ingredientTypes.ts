export type Unit = "pcs" | "ml" | "g";

export interface Ingredient {
    name: string;
    quantity: number;
    unit: Unit;
}

export interface IngredientWithId extends Ingredient {
    id: string;
}
