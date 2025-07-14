import { IngredientWithId, Ingredient, IngredientWithUnitMismatch } from "@/types/ingredientTypes";
import { AvailabilityScore } from "@/types/availabilityScore";
import stringSimilarity from "string-comparison";
import { Recipe } from "@/types/recipeTypes";
import cloneDeep from "lodash.clonedeep";

export const calculateIngredientAvailability = (ingredient: Ingredient): AvailabilityScore => {
    if (!ingredient.name || !ingredient.quantity || ingredient.quantity <= 0) {
        return "bad"; // Ingredient is missing or has no quantity
    }

    if (ingredient.unit === "pcs" && ingredient.quantity < 5) {
        return "medium"; // Low quantity for pieces
    }

    if ((ingredient.unit === "ml" || ingredient.unit === "g") && ingredient.quantity < 100) {
        return "medium"; // Low quantity for ml or g
    }

    return "good"; // Sufficient quantity
};

export const getBestMatchingIngredient = (
    ingredient: Ingredient,
    ingredients: IngredientWithId[]
): IngredientWithId | null => {
    let bestMatch: IngredientWithId | null = null;
    let highestScore = 0;
    let highestNameSimilarity = 0;

    for (const ing of ingredients) {
        const nameSimilarity = stringSimilarity.levenshtein.similarity(
            ingredient.name.toLowerCase(),
            ing.name.toLowerCase()
        );
        const unitSimilarity = ingredient.unit.trim().toLowerCase() === ing.unit.trim().toLowerCase() ? 1 : 0;
        const score = 100 * nameSimilarity + unitSimilarity;

        if (score > highestScore || (score === highestScore && ing.quantity > (bestMatch?.quantity || 0))) {
            highestScore = score;
            highestNameSimilarity = nameSimilarity;
            bestMatch = ing;
        }
    }

    // We allow a levenshtein similarity of at least 0.85 to consider it a match, allowing for minor typos or variations in ingredient names.
    return bestMatch && highestNameSimilarity > 0.85 ? bestMatch : null;
};

export const calculateIngredientAvailabilityForRecipe = (
    ingredient: Ingredient,
    ingredients: IngredientWithId[]
): AvailabilityScore => {
    const foundIngredient = getBestMatchingIngredient(ingredient, ingredients);

    if (!foundIngredient || foundIngredient.quantity <= 0) {
        return "bad"; // Ingredient is missing
    }

    if (foundIngredient.unit !== ingredient.unit) {
        return "medium";
    }

    if (foundIngredient.quantity < ingredient.quantity) {
        return "medium"; // Not enough quantity
    }

    return "good"; // Sufficient quantity
};

export const calculateRecipeAvailability = (recipe: Recipe, ingredients: IngredientWithId[]): AvailabilityScore => {
    const ingredientsAvailability = recipe.ingredients.map((ingredient) =>
        calculateIngredientAvailabilityForRecipe(ingredient, ingredients)
    );

    const shareOfGood =
        ingredientsAvailability.filter((score) => score === "good").length / ingredientsAvailability.length;
    const shareOfMedium =
        ingredientsAvailability.filter((score) => score === "medium").length / ingredientsAvailability.length;
    const shareOfGoodOrMedium = shareOfGood + shareOfMedium;

    if (shareOfGood === 1) {
        return "good"; // All ingredients are good
    }

    if (shareOfGoodOrMedium >= 0.75) {
        return "medium"; // At least three-quarters of the ingredients are medium or good
    }

    return "bad";
};

export interface IngredientMatchingResult {
    usedIngredients: IngredientWithId[];
    missingIngredients: IngredientWithUnitMismatch[];
}

export const determineUsedAndMissingIngredients = (
    recipe: Recipe,
    availableIngredients: IngredientWithId[]
): IngredientMatchingResult => {
    const copiedIngredients = cloneDeep(availableIngredients);

    const usedIngredients: IngredientWithId[] = [];
    const missingIngredients: IngredientWithUnitMismatch[] = [];

    for (const ingredient of recipe.ingredients) {
        const foundIngredient = getBestMatchingIngredient(ingredient, copiedIngredients);
        if (foundIngredient) {
            if (foundIngredient.unit !== ingredient.unit) {
                missingIngredients.push({
                    ...foundIngredient,
                    unitMismatch: true, // Indicates that the unit does not match
                });
            } else {
                const quantityUsed = Math.min(foundIngredient.quantity, ingredient.quantity);
                const quantityMissing = ingredient.quantity - quantityUsed;
                if (quantityUsed > 0) {
                    usedIngredients.push({
                        ...foundIngredient,
                        quantity: quantityUsed,
                    });
                }
                if (quantityMissing > 0) {
                    missingIngredients.push({
                        ...foundIngredient,
                        quantity: quantityMissing,
                        unitMismatch: false,
                    });
                }
                foundIngredient.quantity -= ingredient.quantity; // Reduce the quantity of the used ingredient
            }
        } else {
            // If no matching ingredient is found, we consider it missing
            missingIngredients.push({
                ...ingredient,
                unitMismatch: false, // No unit mismatch since it's completely missing
            });
        }
    }

    return { usedIngredients, missingIngredients };
};
