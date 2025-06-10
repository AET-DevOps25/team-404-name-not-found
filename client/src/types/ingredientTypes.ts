export type Unit = 'pcs' | 'ml' | 'g' | 'kg' | 'l';

export interface Ingredient {
    name: string;
    quantity: number;
    unit: Unit;
}

export interface RenderableIngredient extends Ingredient {
    id: string;
    imageUrl: string;
}
