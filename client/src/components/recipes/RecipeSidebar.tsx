import { ReactNode, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ChefHat, Trash, Bookmark } from "lucide-react";
import RecipesLoadingSpinner from "@/components/recipes/RecipesLoadingSpinner";
import { RecipeWithAvailabilityAndId } from "@/types/recipeTypes";
import { AvailabilityScore } from "@/types/availabilityScore";
import { Button } from "@/components/ui/button";
import { LucideBookmarkFilled } from "@/components/recipes/LucideBookmarkFilled";
import { useHoveredElementId } from "@/hooks/useHoveredElementId";

interface RecipeSaving {
    onToggleSave: (recipe: RecipeWithAvailabilityAndId) => void;
    savedRecipes: RecipeWithAvailabilityAndId[];
}

interface RecipesSidebarProps {
    children: ReactNode;
    loading: boolean;
    recipes: RecipeWithAvailabilityAndId[];
    onRecipeSelect: (recipe: RecipeWithAvailabilityAndId) => void;
    onDelete?: (id: string) => void;
    recipeSaving?: RecipeSaving;
}

const RecipesSidebar = ({
    children,
    loading,
    recipes,
    onRecipeSelect,
    onDelete,
    recipeSaving,
}: RecipesSidebarProps) => {
    const { hoveredId, setHoveredId, reevaluateHoveredId } = useHoveredElementId("data-recipe-id");

    // Re-evaluate hoveredId when recipes change
    useEffect(() => {
        reevaluateHoveredId();
    }, [recipes, reevaluateHoveredId]);

    const isRecipeSaved = (recipe: RecipeWithAvailabilityAndId) => {
        return recipeSaving ? recipeSaving.savedRecipes.some((saved) => saved.id === recipe.id) : false;
    };

    const getAvailabilityBadge = (score?: AvailabilityScore) => {
        if (!score) return null;

        const colors = {
            good: "bg-green-100 text-green-800 border-green-200",
            medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
            bad: "bg-red-100 text-red-800 border-red-200",
        };

        const labels = {
            good: "All ingredients",
            medium: "Most ingredients",
            bad: "Missing ingredients",
        };

        return (
            <Badge variant="outline" className={colors[score as keyof typeof colors]}>
                {labels[score as keyof typeof labels]}
            </Badge>
        );
    };

    const getRecipeCards = () => {
        return recipes.map((recipe) => (
            <Card
                key={recipe.id}
                data-recipe-id={recipe.id}
                className="relative cursor-pointer hover:shadow-md transition-shadow duration-200 bg-white"
                onClick={() => onRecipeSelect(recipe)}
                onMouseEnter={() => setHoveredId(recipe.id)}
                onMouseMove={() => setHoveredId(recipe.id)}
                onMouseLeave={() => setHoveredId(null)}
            >
                {hoveredId === recipe.id && (
                    <div className="absolute top-2 right-2 z-10 flex gap-1">
                        {recipeSaving && (
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-gray-600 hover:text-gray-900"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent card click, dont open modal
                                    recipeSaving.onToggleSave(recipe);
                                }}
                            >
                                {isRecipeSaved(recipe) ? (
                                    <LucideBookmarkFilled className="w-3 h-3" />
                                ) : (
                                    <Bookmark className="w-3 h-3" />
                                )}
                            </Button>
                        )}
                        {onDelete && (
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-red-600 hover:text-red-700"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent card click, dont open modal
                                    onDelete(recipe.id);
                                }}
                            >
                                <Trash className="w-3 h-3" />
                            </Button>
                        )}
                    </div>
                )}

                <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-lg leading-tight">{recipe.title}</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{recipe.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-1.5">
                            <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {recipe.cookingTime} min
                            </div>
                            <div className="flex items-center">
                                <ChefHat className="w-4 h-4 mr-1" />
                                {recipe.difficulty}
                            </div>
                        </div>
                        <div className="flex items-center">{getAvailabilityBadge(recipe.availabilityScore)}</div>
                    </div>
                </CardContent>
            </Card>
        ));
    };

    const emptyPlaceholder = (
        <div className="flex flex-col items-center justify-center gap-4 h-[calc(100vh-12rem)] text-gray-500 text-center">
            {children}
        </div>
    );

    return (
        <div className="space-y-4 h-[calc(100vh-12rem)] overflow-y-auto">
            {loading ? <RecipesLoadingSpinner /> : recipes.length == 0 ? emptyPlaceholder : getRecipeCards()}
        </div>
    );
};

export default RecipesSidebar;
