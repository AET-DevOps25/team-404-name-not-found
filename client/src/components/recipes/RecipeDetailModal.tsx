import ReactMarkdown from "react-markdown";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, ChefHat, Users } from "lucide-react";
import { Recipe } from "@/types/recipeTypes";
import { Ingredient } from "@/types/ingredientTypes";
import { calculateIngredientAvailabilityForRecipe } from "@/utils/calculateAvailability";
import { AvailabilityScore } from "@/types/availabilityScore";

interface RecipeDetailModalProps {
    recipe: Recipe;
    onClose: () => void;
    onCook: (recipe: Recipe) => void;
    availableIngredients: Ingredient[];
}

const RecipeDetailModal = ({ recipe, onClose, onCook, availableIngredients }: RecipeDetailModalProps) => {
    const ingredientsWithAvailabilityScore = recipe.ingredients.map((ingredient) => {
        return {
            ...ingredient,
            availabilityScore: calculateIngredientAvailabilityForRecipe(ingredient, availableIngredients),
        };
    });

    const getIngredientStatusColor = (availability: AvailabilityScore) => {
        switch (availability) {
            case "good":
                return "text-green-600";
            case "medium":
                return "text-yellow-600";
            case "bad":
                return "text-red-600";
            default:
                return "text-gray-600";
        }
    };

    const getIngredientStatusBadge = (availability: AvailabilityScore) => {
        return (
            <Badge variant="outline" className={`${getIngredientStatusColor(availability)} border-current`}>
                {availability === "good" ? "✓" : availability === "medium" ? "!" : "✗"}
            </Badge>
        );
    };

    const hasMissingIngredients =
        ingredientsWithAvailabilityScore.filter(({ availabilityScore }) => availabilityScore === "bad").length > 0;

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
                            {ingredientsWithAvailabilityScore.map((ingredient, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50"
                                >
                                    <span className="text-gray-900">{ingredient.name}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-600">
                                            {ingredient.quantity} {ingredient.unit}
                                        </span>
                                        {getIngredientStatusBadge(ingredient.availabilityScore)}
                                    </div>
                                </div>
                            ))}
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
                                    <span className="text-gray-700 pt-0.5">
                                        <ReactMarkdown>{instruction}</ReactMarkdown>
                                    </span>
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
