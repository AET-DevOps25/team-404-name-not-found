export type Unit = "pcs" | "ml" | "g";

export interface Ingredient {
    id: string;
    name: string;
    quantity: number;
    unit: Unit;
}

export type IngredientNoId = Omit<Ingredient, "id">;

export interface RenderableIngredient extends Ingredient {
    imageUrl: string;
}
