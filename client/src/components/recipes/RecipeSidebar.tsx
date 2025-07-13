import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ChefHat } from "lucide-react";
import { AvailabilityScore, Recipe } from "@/types/recipeTypes.ts";

interface RecipesSidebarProps {
    recipes: Recipe[];
    onRecipeSelect: (recipe: Recipe) => void;
}

const RecipesSidebar = ({ recipes, onRecipeSelect }: RecipesSidebarProps) => {
    const getAvailabilityBadge = (score: AvailabilityScore) => {
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

    return (
        <div className="space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto">
            {recipes.map((recipe) => (
                <Card
                    key={recipe.id}
                    className="cursor-pointer hover:shadow-md transition-shadow duration-200 bg-white"
                    onClick={() => onRecipeSelect(recipe)}
                >
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
            ))}
        </div>
    );
};

export default RecipesSidebar;
