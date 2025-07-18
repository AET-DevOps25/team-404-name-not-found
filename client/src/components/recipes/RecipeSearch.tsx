import { useEffect, useRef, useState } from "react";
import recipesService from "@/api/services/recipesService";
import { RecipeWithAvailabilityAndId } from "@/types/recipeTypes";
import { ClockIcon, ChefHatIcon, Search } from "lucide-react";
import { IngredientWithId } from "@/types/ingredientTypes";
import { calculateRecipeAvailability } from "@/utils/ingredientMatching";
import AvailabilityBadge from "@/components/recipes/AvailabilityBadge";

interface RecipeSearchProps {
    ingredients: IngredientWithId[];
    onResultClicked: (recipe: RecipeWithAvailabilityAndId) => void;
    openedRecipe: RecipeWithAvailabilityAndId | null;
}

const RecipeSearch = ({ onResultClicked, openedRecipe, ingredients }: RecipeSearchProps) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<RecipeWithAvailabilityAndId[]>([]);

    const handleClick = (event: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
            setQuery("");
            setResults([]);
        }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            setQuery("");
            setResults([]);
        }
    };

    const addEventListeners = () => {
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("mousedown", handleClick);
    };

    const removeEventListeners = () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("mousedown", handleClick);
    };

    //  Add event listeners when component mounts or when the recipe detail modal closes
    useEffect(() => {
        console.log("RecipeSearch mounted or modal changed, openedRecipe:", openedRecipe);
        if (!openedRecipe) {
            const timeout = setTimeout(() => {
                console.log("Added listeners");
                addEventListeners();
            }, 300); // Delay to ensure modal is closed before adding listeners
            return () => {
                clearTimeout(timeout);
                removeEventListeners();
            };
        } else {
            console.log("Removed listeners");
            removeEventListeners();
        }
    }, [openedRecipe]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (query.trim() === "") {
                setResults([]);
                return;
            }

            recipesService
                .searchRecipes(query, 5)
                .then((results) => {
                    const recipesWithAvailability = results.map((recipe) => ({
                        ...recipe,
                        availabilityScore: calculateRecipeAvailability(recipe, ingredients),
                    }));
                    setResults(recipesWithAvailability);
                })
                .catch((err) => {
                    console.error("Search failed:", err);
                    setResults([]);
                });
        }, 300);

        return () => clearTimeout(timeout);
    }, [query]);

    return (
        <div ref={wrapperRef} className="w-full max-w-xl mx-auto relative z-50">
            {/* Input field */}
            <div className="px-4 dark:bg-gray-900 z-51 relative">
                <div className="relative w-full">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Search className="w-4 h-4" />
                    </span>
                    <input
                        type="text"
                        className={`${query.trim().length > 0 ? "w-full" : "w-44"} focus:w-full transition-all duration-300 pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring focus:ring-green-600 text-sm`}
                        placeholder="Search recipes..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Results dropdown */}
            {query.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-0 transition-all bg-white dark:bg-gray-900 shadow-md rounded border z-50 ml-4 mr-4 p-4 max-h-96 overflow-y-auto">
                    {results.length === 0 && <div className="text-sm text-muted-foreground">No recipes found.</div>}
                    {results && results.length > 0 && (
                        <ul className="space-y-2">
                            {results.map((recipe) => (
                                <li
                                    key={recipe.id}
                                    onClick={() => onResultClicked(recipe)}
                                    className="py-3 px-4 rounded hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border"
                                >
                                    <div className="flex items-start gap-3 w-full">
                                        <div className="flex flex-col flex-1">
                                            <div className="font-medium text-sm">{recipe.title}</div>
                                            <div className="text-sm text-muted-foreground line-clamp-2">
                                                {recipe.description}
                                            </div>
                                            <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground mt-2">
                                                <div className="flex items-center gap-1">
                                                    <div className="flex items-center gap-1">
                                                        <ClockIcon className="w-4 h-4" />
                                                        <span>{recipe.cookingTime} min</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 capitalize">
                                                        <ChefHatIcon className="w-4 h-4" />
                                                        <span>{recipe.difficulty}</span>
                                                    </div>
                                                </div>
                                                <AvailabilityBadge score={recipe.availabilityScore} />
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default RecipeSearch;
