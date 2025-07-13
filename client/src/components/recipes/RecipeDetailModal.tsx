import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, ChefHat, Users } from "lucide-react";
import { Recipe } from "@/types/recipeTypes";
import { Ingredient } from "@/types/ingredientTypes";

interface RecipeDetailModalProps {
    recipe: Recipe;
    onClose: () => void;
    onCook: (recipe: Recipe) => void;
    availableIngredients: Ingredient[];
}

const RecipeDetailModal = ({ recipe, onClose, onCook, availableIngredients }: RecipeDetailModalProps) => {
    const checkIngredientAvailability = (recipeIngredient: { name: string; quantity: number; unit: string }) => {
        const available = availableIngredients.find(
            (ing) => ing.name.toLowerCase() === recipeIngredient.name.toLowerCase()
        );

        if (!available) return "missing";
        if (available.quantity >= recipeIngredient.quantity) return "sufficient";
        return "insufficient";
    };

    const getIngredientStatusColor = (status: string) => {
        switch (status) {
            case "sufficient":
                return "text-green-600";
            case "insufficient":
                return "text-yellow-600";
            case "missing":
                return "text-red-600";
            default:
                return "text-gray-600";
        }
    };

    const getMissingIngredients = () => {
        return recipe.ingredients.filter((ing) => {
            const status = checkIngredientAvailability(ing);
            return status === "missing" || status === "insufficient";
        });
    };

    const missingIngredients = getMissingIngredients();
    const hasMissingIngredients = missingIngredients.length > 0;

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-900">{recipe.title}</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Recipe Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {recipe.cookingTime} minutes
                        </div>
                        <div className="flex items-center">
                            <ChefHat className="w-4 h-4 mr-1" />
                            {recipe.difficulty}
                        </div>
                        <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            2-3 servings
                        </div>
                    </div>

                    <p className="text-gray-700">{recipe.description}</p>

                    <Separator />

                    {/* Ingredients */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ingredients</h3>
                        <div className="space-y-2">
                            {recipe.ingredients.map((ingredient, index) => {
                                const status = checkIngredientAvailability(ingredient);
                                return (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50"
                                    >
                                        <span className="text-gray-900">{ingredient.name}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-600">
                                                {ingredient.quantity} {ingredient.unit}
                                            </span>
                                            <Badge
                                                variant="outline"
                                                className={`${getIngredientStatusColor(status)} border-current`}
                                            >
                                                {status === "sufficient" ? "✓" : status === "insufficient" ? "!" : "✗"}
                                            </Badge>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <Separator />

                    {/* Instructions */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructions</h3>
                        <ol className="space-y-3">
                            {recipe.instructions.map((instruction, index) => (
                                <li key={index} className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                        {index + 1}
                                    </span>
                                    <span className="text-gray-700 pt-0.5">{instruction}</span>
                                </li>
                            ))}
                        </ol>
                    </div>

                    {/* Cook Button */}
                    <div className="pt-4 border-t">
                        <Button
                            onClick={() => onCook(recipe)}
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                        >
                            Cook Now! 🍳
                        </Button>
                        {hasMissingIngredients && (
                            <p className="text-sm text-amber-600 text-center mt-2">
                                ⚠️ You're missing some ingredients. They'll be added to your shopping list after
                                cooking.
                            </p>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default RecipeDetailModal;
