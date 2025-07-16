import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Loader2, Plus, Eye, Telescope, ListRestart } from "lucide-react";
import { Ingredient } from "@/types/ingredientTypes";
import imagesService from "@/api/services/imagesService";
import { toast } from "@/hooks/useToast";
import { useIsMobile } from "@/hooks/useIsMobile";
import { IconButtonWithTooltip } from "@/components/recipes/IconButtonWithTooltip";

interface ScanIngredientModalProps {
    onClose: () => void;
    onAddToFridge: (ingredients: Ingredient[]) => void;
    onAddAndGenerateRecipes: (ingredients: Ingredient[], explore: boolean) => void;
}

const ScanIngredientModal = ({ onClose, onAddToFridge, onAddAndGenerateRecipes }: ScanIngredientModalProps) => {
    const { isMobile } = useIsMobile();
    const inputRef = useRef<HTMLInputElement>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [scannedIngredients, setScannedIngredients] = useState<Ingredient[] | null>(null);

    const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setScannedIngredients(null);
    };

    const handleUploadPhoto = () => inputRef.current?.click();

    const handleScan = async () => {
        if (!imageFile) return;
        setLoading(true);
        setScannedIngredients(null);

        try {
            console.log(imageFile.size);
            const ingredients = await imagesService.analyzeIngredients(imageFile);
            setScannedIngredients(ingredients);
        } catch (err) {
            toast({
                title: "Error",
                description: "Failed to scan ingredients. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAddToFridge = () => {
        if (scannedIngredients) {
            onAddToFridge(scannedIngredients);
            onClose();
        }
    };

    const handleGenerateRecipes = (explore: boolean) => {
        if (scannedIngredients) {
            onAddAndGenerateRecipes(scannedIngredients, explore);
            onClose();
        }
    };

    const getStepHeader = (text: string) => {
        return (
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{text}</h4>
                <IconButtonWithTooltip
                    tooltip="New Scan"
                    onClick={() => {
                        setScannedIngredients(null);
                        handleUploadPhoto();
                    }}
                >
                    <ListRestart />
                </IconButtonWithTooltip>
            </div>
        );
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-md [&>button]:hidden">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Scan Fridge</DialogTitle>
                </DialogHeader>

                <div className="">
                    {!imageFile && (
                        <div className="flex gap-4">
                            {isMobile ? (
                                <Button variant="outline" className="flex-1" onClick={handleUploadPhoto}>
                                    <Camera className="w-4 h-4 mr-2" />
                                    Take Photo
                                </Button>
                            ) : (
                                <Button variant="outline" className="flex-1" onClick={handleUploadPhoto}>
                                    <Upload className="w-4 h-4 mr-2" />
                                    Upload Photo
                                </Button>
                            )}
                        </div>
                    )}

                    <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileInput} />

                    {imageFile && !scannedIngredients && (
                        <div className="space-y-2">
                            {getStepHeader("Your photo")}
                            <div className="flex flex-col items-center space-y-3">
                                <img
                                    src={URL.createObjectURL(imageFile)}
                                    alt="Fridge preview"
                                    className="max-h-60 rounded-lg border border-gray-300"
                                />
                                {!scannedIngredients && (
                                    <Button
                                        onClick={handleScan}
                                        disabled={loading}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                                Scanning...
                                            </>
                                        ) : (
                                            <>Scan Ingredients</>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}

                    {scannedIngredients && (
                        <div className="space-y-2">
                            {getStepHeader("Scanned Ingredients")}
                            <div className="overflow-y-auto max-h-64 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow">
                                <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
                                    {scannedIngredients.map((ing, idx) => (
                                        <li key={idx}>
                                            {ing.name} – {ing.quantity} {ing.unit}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Button
                                className="w-full bg-green-600 hover:bg-green-700 transition text-white mt-4"
                                onClick={handleAddToFridge}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add to Fridge
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full py-5 transition"
                                onClick={() => {
                                    handleGenerateRecipes(false);
                                }}
                            >
                                <Eye className="text-blue-400" />
                                Generate Recipes - Match My Ingredients
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full py-5 transition"
                                onClick={() => {
                                    handleGenerateRecipes(true);
                                }}
                            >
                                <Telescope className="text-yellow-500" />
                                Generate Recipes - Explorative AI Mode
                            </Button>
                        </div>
                    )}

                    <div className="pt-4">
                        <Button variant="destructive" onClick={onClose} className="w-full" disabled={loading}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ScanIngredientModal;
