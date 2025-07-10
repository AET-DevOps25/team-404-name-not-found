import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash, Pen } from "lucide-react";
import { Ingredient } from "@/types/ingredientTypes";

interface IngredientGridProps {
    ingredients: Ingredient[];
    onEdit: (ingredient: Ingredient) => void;
    onDelete: (id: string) => void;
}

const IngredientGrid = ({ ingredients, onEdit, onDelete }: IngredientGridProps) => {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    const getQuantityColor = (quantity: number, unit: string) => {
        if (quantity === 0) return "bg-red-100 text-red-800";
        if (quantity < 5 && unit === "pcs") return "bg-yellow-100 text-yellow-800";
        if (quantity < 100 && (unit === "ml" || unit === "g")) return "bg-yellow-100 text-yellow-800";
        return "bg-green-100 text-green-800";
    };

    if (ingredients.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">Your fridge is empty!</div>
                <p className="text-gray-500">Add some ingredients to get started with recipes.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {ingredients.map((ingredient) => (
                <Card
                    key={ingredient.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow duration-200 bg-white relative"
                    onMouseEnter={() => setHoveredId(ingredient.id)}
                    onMouseLeave={() => setHoveredId(null)}
                >
                    <div className="aspect-square flex items-center justify-center bg-gray-100 relative text-5xl font-bold text-gray-400">
                        {ingredient.name.charAt(0).toUpperCase()}
                        {hoveredId === ingredient.id && (
                            <div className="absolute top-2 right-2 flex gap-1">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                                    onClick={() => onEdit(ingredient)}
                                >
                                    <Pen className="w-3 h-3" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-red-600 hover:text-red-700"
                                    onClick={() => onDelete(ingredient.id)}
                                >
                                    <Trash className="w-3 h-3" />
                                </Button>
                            </div>
                        )}
                    </div>
                    <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 truncate">{ingredient.name}</h3>
                        <Badge
                            variant="outline"
                            className={`${getQuantityColor(ingredient.quantity, ingredient.unit)} border-0`}
                        >
                            {ingredient.quantity} {ingredient.unit}
                        </Badge>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default IngredientGrid;
