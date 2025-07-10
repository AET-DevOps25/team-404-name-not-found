export type Unit = "pcs" | "ml" | "g";

export interface Ingredient {
    id: string;
    name: string;
    quantity: number;
    unit: Unit;
}

export interface RenderableIngredient extends Ingredient {
    imageUrl: string;
}
