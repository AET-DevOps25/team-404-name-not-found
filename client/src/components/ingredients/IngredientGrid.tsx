import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash, Pen, CheckSquare, XSquare } from "lucide-react";
import { IngredientWithId } from "@/types/ingredientTypes";
import { calculateIngredientAvailability } from "@/utils/ingredientMatching";
import { useHoveredElementId } from "@/hooks/useHoveredElementId";
import { IconButtonWithTooltip } from "@/components/recipes/IconButtonWithTooltip";

interface IngredientGridProps {
    ingredients: IngredientWithId[];
    onEdit: (ingredient: IngredientWithId) => void;
    onDelete: (id: string) => void;
    onSelectionChange: (selectedIds: string[] | null) => void;
}

const IngredientGrid = ({ ingredients, onEdit, onDelete, onSelectionChange }: IngredientGridProps) => {
    const { hoveredId, setHoveredId, reevaluateHoveredId } = useHoveredElementId("data-ingredient-id");

    const [selectionModeEnabled, setSelectionModeEnabled] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Reevaluate hovered ID when ingredients change
    useEffect(() => {
        reevaluateHoveredId();
    }, [ingredients, reevaluateHoveredId]);

    // Update selection state in parent when selection mode changes
    useEffect(() => {
        onSelectionChange(selectedIds.length === 0 ? null : selectedIds);
    }, [selectedIds]);

    // Close selection mode on Escape key press
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && selectionModeEnabled) {
                e.preventDefault();
                toggleSelectionMode();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectionModeEnabled]);

    const toggleSelectionMode = () => {
        setSelectedIds([]);
        setSelectionModeEnabled((prev) => !prev);
    };

    const toggleIngredientSelection = (id: string) => {
        if (!selectionModeEnabled) return;

        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
    };

    const getQuantityColor = (ingredient: IngredientWithId) => {
        const availabilityScore = calculateIngredientAvailability(ingredient);
        switch (availabilityScore) {
            case "bad":
                return "bg-red-100 text-red-800";
            case "medium":
                return "bg-yellow-100 text-yellow-800";
            case "good":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
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
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Ingredients</h2>
                <IconButtonWithTooltip
                    tooltip={selectionModeEnabled ? "Cancel selection" : "Select Ingredients"}
                    onClick={toggleSelectionMode} // Make sure to wire this up
                >
                    {selectionModeEnabled ? (
                        <XSquare className="h-5 w-5 text-red-600" />
                    ) : (
                        <CheckSquare className="h-5 w-5" />
                    )}
                </IconButtonWithTooltip>
            </div>
            <div className="space-y-4 h-[calc(100vh-12rem)] overflow-y-auto">
                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {ingredients.map((ingredient) => {
                        const isSelected = selectedIds.includes(ingredient.id);
                        const selectionModeClassName = isSelected
                            ? "border-green-600 shadow-md cursor-pointer"
                            : "border-transparent cursor-pointer";

                        return (
                            <Card
                                key={ingredient.id}
                                data-ingredient-id={ingredient.id}
                                className={`overflow-hidden transition-shadow duration-200 relative bg-white border-2 ${
                                    selectionModeEnabled && selectionModeClassName
                                }`}
                                onClick={() => toggleIngredientSelection(ingredient.id)}
                                onMouseEnter={() => setHoveredId(ingredient.id)}
                                onMouseLeave={() => setHoveredId(null)}
                            >
                                <div className="aspect-square flex items-center justify-center bg-gray-100 relative text-5xl font-bold text-gray-400">
                                    {ingredient.name.charAt(0).toUpperCase()}
                                    {!selectionModeEnabled && hoveredId === ingredient.id && (
                                        <div className="absolute top-2 right-2 flex gap-1">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEdit(ingredient);
                                                }}
                                            >
                                                <Pen className="w-3 h-3" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-red-600 hover:text-red-700"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDelete(ingredient.id);
                                                }}
                                            >
                                                <Trash className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    )}
                                    {selectionModeEnabled && (
                                        <div className="absolute top-2 right-2">
                                            <div className="w-4 h-4 border-2 border-gray-400 rounded-sm bg-white flex items-center justify-center">
                                                {isSelected && <div className="w-2 h-2 bg-green-600 rounded-sm" />}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <CardContent className="p-4">
                                    <h3 className="font-semibold text-gray-900 mb-2 truncate">{ingredient.name}</h3>
                                    <Badge variant="outline" className={`${getQuantityColor(ingredient)} border-0`}>
                                        {ingredient.quantity} {ingredient.unit}
                                    </Badge>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default IngredientGrid;
