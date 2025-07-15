import { Button } from "@/components/ui/button";
import { Eye, Telescope } from "lucide-react";

interface FloatingRecipeGenerationButtonsProps {
    recipeSuggestionsLoading: boolean;
    onGenerateRecipes: (explorativeMode: boolean) => void;
}

const FloatingRecipeGenerationButtons = ({
    recipeSuggestionsLoading,
    onGenerateRecipes,
}: FloatingRecipeGenerationButtonsProps) => {
    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4 w-45">
            <Button
                disabled={recipeSuggestionsLoading}
                variant="default"
                className="text-base py-5 rounded-2xl shadow-lg hover:shadow-xl transition"
                onClick={() => {
                    onGenerateRecipes(false);
                }}
            >
                <Eye className="text-blue-400" />
                Match My Ingredients
            </Button>
            <Button
                disabled={recipeSuggestionsLoading}
                variant="outline"
                className="text-base py-5 rounded-2xl shadow-lg hover:shadow-xl transition"
                onClick={() => {
                    onGenerateRecipes(true);
                }}
            >
                <Telescope className="text-yellow-500" /> Explorative AI Mode
            </Button>
        </div>
    );
};

export default FloatingRecipeGenerationButtons;
