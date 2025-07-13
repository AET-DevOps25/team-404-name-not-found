import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, LogOut, Plus, Refrigerator, Settings } from "lucide-react";
import IngredientGrid from "@/components/ingredients/IngredientGrid";
import { Ingredient, IngredientNoId } from "@/types/ingredientTypes";
import { useAuth } from "@/context/AuthContext";
import ingredientsService from "@/api/services/ingredientsService";
import { toast } from "@/hooks/use-toast";
import AddIngredientModal from "@/components/ingredients/AddIngredientModal";
import EditIngredientModal from "@/components/ingredients/EditIngredientModal";
import RecipesSidebar from "@/components/recipes/RecipeSidebar";
import { Recipe, RecipeNoAvailabilityScore } from "@/types/recipeTypes";
import recipesService from "@/api/services/recipesService";
import { dummyRecipes } from "@/dummyRecipes";
import RecipeDetailModal from "@/components/recipes/RecipeDetailModal";
import { calculateRecipeAvailability } from "@/utils/calculateAvailability";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Dashboard = () => {
    const { logout } = useAuth();

    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [showAddIngredientModal, setShowAddIngredientModal] = useState(false);
    const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);

    const [activeRecipeTab, setActiveRecipeTab] = useState("suggestions");

    const [recipeSuggestions, setRecipeSuggestions] = useState<Recipe[]>(dummyRecipes);
    const [recipesLoading, setRecipesLoading] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

    // @ts-ignore
    const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);

    const errorHandler = (error: Error) => {
        toast({
            variant: "destructive",
            title: "Error",
            description: error.message,
        });
    };

    const addIngredient = (ingredient: IngredientNoId) => {
        setShowAddIngredientModal(false);

        ingredientsService
            .saveIngredients([ingredient])
            .then((newIngredients) => {
                console.log("Ingredients added successfully:", newIngredients);
                setIngredients((prev) => [...prev, ...newIngredients]);
            })
            .catch((error: Error) => {
                errorHandler(error);
            });
    };

    const deleteIngredient = (id: string) => {
        ingredientsService
            .deleteById(id)
            .then(() => {
                console.log(`Ingredient with id ${id} deleted successfully`);
                setIngredients((prev) => prev.filter((ingredient) => ingredient.id !== id));
            })
            .catch((error: Error) => {
                errorHandler(error);
            });
    };

    const editIngredient = (ingredient: Ingredient) => {
        setEditingIngredient(null);

        ingredientsService
            .updateIngredient(ingredient)
            .then((updatedIngredient) => {
                console.log("Ingredient updated successfully:", updatedIngredient);
                setIngredients((prev) =>
                    prev.map((ing) => (ing.id === updatedIngredient.id ? updatedIngredient : ing))
                );
            })
            .catch((error: Error) => {
                errorHandler(error);
            });
    };

    const removeZeroQuantityIngredients = (recipe: RecipeNoAvailabilityScore): RecipeNoAvailabilityScore => {
        return {
            ...recipe,
            ingredients: recipe.ingredients.filter((ingredient) => ingredient.quantity > 0),
        };
    };

    const addAvaiabilityScore = (recipe: RecipeNoAvailabilityScore): Recipe => {
        const availabilityScore = calculateRecipeAvailability(recipe, ingredients);
        return {
            ...recipe,
            availabilityScore,
        };
    };

    const generateRecipes = (explore: boolean) => {
        setRecipesLoading(true);
        recipesService
            .generateRecipes(3, explore, ingredients)
            .then((recipes) => {
                console.log("Recipes generated successfully:", recipes);
                const cleanedRecipes = recipes
                    .map((recipe) => removeZeroQuantityIngredients(recipe))
                    .map((recipe) => addAvaiabilityScore(recipe));
                setRecipeSuggestions(cleanedRecipes);
            })
            .catch((error: Error) => {
                errorHandler(error);
            })
            .finally(() => {
                setRecipesLoading(false);
            });
    };

    const saveRecipe = (recipe: Recipe) => {
        recipesService
            .save(recipe)
            .then((savedRecipe) => {
                console.log("Recipe saved successfully:", savedRecipe);
                const withAvailabilityScore = addAvaiabilityScore(savedRecipe);
                setSavedRecipes((prev) => [...prev, addAvaiabilityScore(withAvailabilityScore)]);
                setSelectedRecipe(withAvailabilityScore); // Must be set because id changes!
            })
            .catch((error: Error) => {
                errorHandler(error);
            });
    };

    const deleteRecipe = (id: string) => {
        recipesService
            .deleteById(id)
            .then(() => {
                console.log(`Recipe with id ${id} deleted successfully`);
                setSavedRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
            })
            .catch((error: Error) => {
                errorHandler(error);
            });
    };

    const isRecipeSaved = (recipe: Recipe): boolean => {
        return savedRecipes.some((r) => r.id === recipe.id);
    };

    const toggleRecipeSaved = (recipe: Recipe) => {
        if (isRecipeSaved(recipe)) {
            // Recipe is already saved, delete it
            deleteRecipe(recipe.id);
        } else {
            // Recipe is not saved, save it
            saveRecipe(recipe);
        }
    };

    useEffect(() => {
        console.log("Dashboard mounted, fetching ingredients and saved recipes...");
        // Fetch ingredients from the API
        ingredientsService
            .getAll()
            .then((fetchedIngredients) => {
                setIngredients(fetchedIngredients);
            })
            .catch((error: Error) => {
                errorHandler(error);
            });

        recipesService
            .getAll()
            .then((recipes) => {
                console.log("Fetched saved recipes:", recipes);
                // Calculate availability scores for the generated recipes
                const recipesWithAvailability = recipes.map((recipe) => {
                    const availabilityScore = calculateRecipeAvailability(recipe, ingredients);
                    return {
                        ...recipe,
                        availabilityScore,
                    };
                });
                setSavedRecipes(recipesWithAvailability);
            })
            .catch((error: Error) => {
                errorHandler(error);
            });
    }, []);

    // Update recipe availability scores whenever ingredients or recipes change
    useEffect(() => {
        recipeSuggestions.forEach((recipe) => {
            const updatedAvailabilityScore = calculateRecipeAvailability(recipe, ingredients);

            if (updatedAvailabilityScore === recipe.availabilityScore) {
                // No change in availability score, skip update
                return;
            }

            const updatedRecipe = {
                ...recipe,
                availabilityScore: updatedAvailabilityScore,
            };
            setRecipeSuggestions((prev) => prev.map((r) => (r.id === recipe.id ? updatedRecipe : r)));

            console.log("Updated recipe availability score:", updatedRecipe.title);
        });
    }, [ingredients]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <div className="flex items-center">
                                <Refrigerator className="w-8 h-8 text-green-600 mr-3" />
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    What's In My Fridge
                                </h1>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setShowAddIngredientModal(true);
                                }}
                                className="border-green-200 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Ingredient
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {}} // TODO: Show camera modal/view
                                className="border-orange-200 text-orange-700 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-400 dark:hover:bg-orange-900"
                            >
                                <Camera className="w-4 h-4 mr-2" />
                                Scan Fridge
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={logout}
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex gap-8">
                    {/* Ingredients Section - 2/3 width */}
                    <div className="flex-1">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Ingredients</h2>
                        </div>
                        <IngredientGrid
                            ingredients={ingredients}
                            onEdit={setEditingIngredient}
                            onDelete={deleteIngredient}
                        />
                    </div>

                    {/* Recipes Sidebar - 1/3 width */}
                    <div className="w-96">
                        <Tabs value={activeRecipeTab} onValueChange={setActiveRecipeTab} className="w-full">
                            <div className="flex items-center justify-between mb-4">
                                <TabsList>
                                    <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                                    <TabsTrigger value="saved">Saved Recipes</TabsTrigger>
                                </TabsList>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {}} // TODO: Open settings
                                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                >
                                    <Settings className="w-4 h-4" />
                                </Button>
                            </div>

                            <TabsContent value="suggestions">
                                <RecipesSidebar
                                    loading={recipesLoading}
                                    recipes={recipeSuggestions}
                                    onRecipeSelect={setSelectedRecipe}
                                />
                            </TabsContent>

                            <TabsContent value="saved">
                                <RecipesSidebar
                                    loading={false}
                                    recipes={savedRecipes}
                                    onRecipeSelect={setSelectedRecipe}
                                />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>

            {/* Floating AI Buttons */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4 w-72">
                <Button
                    disabled={recipesLoading}
                    variant="default"
                    className="text-base py-5 rounded-2xl shadow-lg hover:shadow-xl transition"
                    onClick={() => {
                        generateRecipes(false);
                    }}
                >
                    🍳 Match My Ingredients
                </Button>
                <Button
                    disabled={recipesLoading}
                    variant="outline"
                    className="text-base py-5 rounded-2xl shadow-lg hover:shadow-xl transition"
                    onClick={() => {
                        generateRecipes(true);
                    }}
                >
                    🌟 Explorative AI Mode
                </Button>
            </div>

            {/* Modals */}
            {showAddIngredientModal && (
                <AddIngredientModal onClose={() => setShowAddIngredientModal(false)} onAdd={addIngredient} />
            )}
            {editingIngredient && (
                <EditIngredientModal
                    ingredient={editingIngredient}
                    onClose={() => setEditingIngredient(null)}
                    onSave={editIngredient}
                />
            )}
            {selectedRecipe && (
                <RecipeDetailModal
                    recipe={selectedRecipe}
                    availableIngredients={ingredients}
                    isSaved={isRecipeSaved(selectedRecipe)}
                    onToggleSave={() => toggleRecipeSaved(selectedRecipe)}
                    onClose={() => setSelectedRecipe(null)}
                    onCook={(recipe) => {
                        console.log("Cooking recipe:", recipe);
                    }}
                />
            )}
        </div>
    );
};

export default Dashboard;
