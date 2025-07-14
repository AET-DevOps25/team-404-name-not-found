import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getNumberOfRecipesToGenerate, setNumberOfRecipesToGenerate } from "@/utils/settings";

interface SettingsModalProps {
    onClose: () => void;
}

const RecipeSettingsModal = ({ onClose }: SettingsModalProps) => {
    const [tempValue, setTempValue] = useState(getNumberOfRecipesToGenerate().toString());

    const handleSave = () => {
        const parsed = parseInt(tempValue, 10);
        if (!isNaN(parsed) && parsed > 0) {
            setNumberOfRecipesToGenerate(parsed);
            onClose();
        } else {
            alert("Please enter a valid number greater than 0");
        }
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-bold">Recipe Generation Settings</DialogTitle>
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Number of Recipes Setting */}
                    <div>
                        <div className="space-y-2">
                            <Label htmlFor="num-recipes" className="text-sm font-medium text-gray-700">
                                Number of recipes to generate
                            </Label>
                            <Input
                                id="num-recipes"
                                type="number"
                                min={1}
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                                className="w-32"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                        <Button variant="outline" onClick={onClose} className="flex-1">
                            Cancel
                        </Button>
                        <Button onClick={handleSave} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                            Save Settings
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default RecipeSettingsModal;
