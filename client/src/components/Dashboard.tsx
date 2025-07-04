import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Refrigerator, Camera, Plus, LogOut, Settings } from "lucide-react";
import IngredientGrid from "@/components/ingredients/IngredientGrid";
import { RenderableIngredient } from "@/types/ingredientTypes";
import { dummyIngredients } from "@/dummyIngredients";

interface DashboardProps {
    onLogout: () => void;
}

const Dashboard = ({ onLogout }: DashboardProps) => {
    // @ts-ignore
    const [ingredients, setIngredients] = useState<RenderableIngredient[]>(dummyIngredients);

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
                                onClick={() => {}} // TODO: Show add ingredient modal
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
                                onClick={onLogout}
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
                            onEdit={() => {}} // TODO: Add function to edit
                            onDelete={() => {}} // TODO: Add function to delete
                        />
                    </div>

                    {/* Recipes Sidebar - 1/3 width */}
                    <div className="w-96">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recipe Suggestions</h2>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {}} // TODO Show settings
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                            >
                                <Settings className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
