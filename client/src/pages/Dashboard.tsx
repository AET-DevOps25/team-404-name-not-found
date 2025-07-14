import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, LogOut, Plus, Refrigerator, Settings } from "lucide-react";
import IngredientGrid from "@/components/ingredients/IngredientGrid";
import { Ingredient, IngredientNoId } from "@/types/ingredientTypes";
import { useAuth } from "@/context/AuthContext";
import ingredientsService from "@/api/services/ingredientsService";
import { toast } from "@/hooks/useToast";
import AddIngredientModal from "@/components/ingredients/AddIngredientModal";
import EditIngredientModal from "@/components/ingredients/EditIngredientModal";
import RecipesSidebar from "@/components/recipes/RecipeSidebar";
import { Recipe, RecipeNoAvailabilityScore } from "@/types/recipeTypes";
import recipesService from "@/api/services/recipesService";
import RecipeDetailModal from "@/components/recipes/RecipeDetailModal";
import { calculateRecipeAvailability } from "@/utils/calculateAvailability";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import RecipeSettingsModal from "@/components/recipes/RecipeSettingsModal";
import { getNumberOfRecipesToGenerate } from "@/utils/settings";

const Dashboard = () => {
    const { logout } = useAuth();

    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [showAddIngredientModal, setShowAddIngredientModal] = useState(false);
    const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);

    const [activeRecipeTab, setActiveRecipeTab] = useState("suggestions");

    const [recipeSuggestions, setRecipeSuggestions] = useState<Recipe[]>([]);
    const [recipeSuggestionsLoading, setRecipeSuggestionsLoading] = useState(false);
    const [openedRecipe, setOpenedRecipe] = useState<Recipe | null>(null);

    const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
    const [showRecipeSettingsModal, setShowRecipeSettingsModal] = useState(false);

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

    const addAvailabilityScore = (recipe: RecipeNoAvailabilityScore): Recipe => {
        const availabilityScore = calculateRecipeAvailability(recipe, ingredients);
        return {
            ...recipe,
            availabilityScore,
        };
    };

    const addAvailabilityScoresAndCleanRecipes = (recipes: RecipeNoAvailabilityScore[]): Recipe[] => {
        return recipes.map(removeZeroQuantityIngredients).map(addAvailabilityScore);
    };

    const generateRecipes = (explore: boolean) => {
        setRecipeSuggestionsLoading(true);
        recipesService
            .generateRecipes(getNumberOfRecipesToGenerate(), explore, ingredients)
            .then((recipes) => {
                console.log("Recipes generated successfully:", recipes);
                setRecipeSuggestions(addAvailabilityScoresAndCleanRecipes(recipes));
            })
            .catch((error: Error) => {
                errorHandler(error);
            })
            .finally(() => {
                setRecipeSuggestionsLoading(false);
            });
    };

    const saveRecipe = (recipe: Recipe) => {
        return recipesService
            .save(recipe)
            .then((savedRecipe) => {
                console.log("Recipe saved successfully:", savedRecipe);
                const withAvailabilityScore = addAvailabilityScore(savedRecipe);
                setSavedRecipes((prev) => [...prev, withAvailabilityScore]);
                return withAvailabilityScore;
            })
            .catch((error: Error) => {
                errorHandler(error);
                throw error; // Re-throw to handle in the calling function
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

    const isRecipeInSuggestions = (recipe: Recipe): boolean => {
        return recipeSuggestions.some((r) => r.id === recipe.id);
    };

    const isRecipeOpened = (recipe: Recipe): boolean => {
        return openedRecipe ? openedRecipe.id === recipe.id : false;
    };

    const toggleRecipeSaved = (recipeToSave: Recipe) => {
        if (isRecipeSaved(recipeToSave)) {
            // Recipe is already saved, delete it
            deleteRecipe(recipeToSave.id);
        } else {
            // Recipe is not saved, save it
            saveRecipe(recipeToSave).then((savedRecipe) => {
                if (isRecipeInSuggestions(recipeToSave)) {
                    // Update the recipeSuggestions state to reflect the saved recipe, id changes after saving
                    setRecipeSuggestions((prev) => prev.map((r) => (r.id === recipeToSave.id ? savedRecipe : r)));
                }
                if (isRecipeOpened(recipeToSave)) {
                    // If the recipe to be saved is opened, we need to update the openedRecipe because its id has changed after saving
                    setOpenedRecipe(savedRecipe);
                }
            });
        }
    };

    const fetchIngredients = () => {
        ingredientsService
            .getAll()
            .then((ingredients) => {
                console.log("Successfully fetched ingredients:", ingredients);
                setIngredients(ingredients);
            })
            .catch((error: Error) => {
                errorHandler(error);
            });
    };

    const fetchSavedRecipes = () => {
        return recipesService
            .getAll()
            .then((recipes) => {
                const withAvailabilityScores = addAvailabilityScoresAndCleanRecipes(recipes);
                console.log("Successfully fetched saved recipes:", withAvailabilityScores);
                setSavedRecipes(withAvailabilityScores);
            })
            .catch((error: Error) => {
                errorHandler(error);
            });
    };

    const updateAvailabilityScores = (recipes: Recipe[]): Recipe[] => {
        return recipes.map((recipe) => {
            const updatedAvailabilityScore = calculateRecipeAvailability(recipe, ingredients);

            if (updatedAvailabilityScore === recipe.availabilityScore) {
                // No change in availability score, return the recipe as is
                return recipe;
            }
            console.log("Updated recipe availability score:", recipe.title);

            return {
                ...recipe,
                availabilityScore: updatedAvailabilityScore,
            };
        });
    };

    useEffect(() => {
        console.log("Dashboard mounted, fetching ingredients and saved recipes...");
        // Fetch saves recipes and ingredients from the API
        // Recipes must be fetched first so their availability scores can be updated by the ingredients update hook
        fetchSavedRecipes().finally(() => {
            fetchIngredients();
        });
    }, []);

    // Update recipe availability scores whenever ingredients change
    useEffect(() => {
        console.log("Ingredients changed, updating recipe availability scores...");
        setRecipeSuggestions((prev) => updateAvailabilityScores(prev));
        setSavedRecipes((prev) => updateAvailabilityScores(prev));
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
                                    onClick={() => {
                                        setShowRecipeSettingsModal(true);
                                    }}
                                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                >
                                    <Settings className="w-4 h-4" />
                                </Button>
                            </div>

                            <TabsContent value="suggestions">
                                <RecipesSidebar
                                    loading={recipeSuggestionsLoading}
                                    recipes={recipeSuggestions}
                                    onRecipeSelect={setOpenedRecipe}
                                    recipeSaving={{
                                        onToggleSave: toggleRecipeSaved,
                                        savedRecipes: savedRecipes,
                                    }}
                                />
                            </TabsContent>

                            <TabsContent value="saved">
                                <RecipesSidebar
                                    onDelete={deleteRecipe}
                                    loading={false}
                                    recipes={savedRecipes}
                                    onRecipeSelect={setOpenedRecipe}
                                />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>

            {/* Floating AI Buttons */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4 w-45">
                <Button
                    disabled={recipeSuggestionsLoading}
                    variant="default"
                    className="text-base py-5 rounded-2xl shadow-lg hover:shadow-xl transition"
                    onClick={() => {
                        generateRecipes(false);
                    }}
                >
                    🍳 Match My Ingredients
                </Button>
                <Button
                    disabled={recipeSuggestionsLoading}
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
            {openedRecipe && (
                <RecipeDetailModal
                    recipe={openedRecipe}
                    availableIngredients={ingredients}
                    isSaved={isRecipeSaved(openedRecipe)}
                    onToggleSave={() => toggleRecipeSaved(openedRecipe)}
                    onClose={() => setOpenedRecipe(null)}
                    onCook={(recipe) => {
                        console.log("Cooking recipe:", recipe);
                    }}
                />
            )}
            {showRecipeSettingsModal && <RecipeSettingsModal onClose={() => setShowRecipeSettingsModal(false)} />}
        </div>
    );
};

export default Dashboard;
