import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Ingredient } from "@/types/ingredientTypes";

interface EditIngredientModalProps {
    ingredient: Ingredient;
    onClose: () => void;
    onSave: (ingredient: Ingredient) => void;
}

const EditIngredientModal = ({ ingredient, onClose, onSave }: EditIngredientModalProps) => {
    const [formData, setFormData] = useState({
        name: ingredient.name,
        quantity: ingredient.quantity.toString(),
        unit: ingredient.unit,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.quantity) return;

        onSave({
            ...ingredient,
            name: formData.name,
            quantity: parseInt(formData.quantity),
            unit: formData.unit as any,
        });
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-md [&>button]:hidden">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Edit Ingredient</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="ingredient-name">Ingredient Name</Label>
                        <Input
                            id="ingredient-name"
                            type="text"
                            placeholder="e.g., Tomatoes"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="border-gray-200 focus:border-green-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="quantity">Quantity</Label>
                            <Input
                                id="quantity"
                                type="number"
                                placeholder="0"
                                min="0"
                                step="1"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                required
                                className="border-gray-200 focus:border-green-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="unit">Unit</Label>
                            <Select
                                value={formData.unit}
                                onValueChange={(value: any) => setFormData({ ...formData, unit: value })}
                            >
                                <SelectTrigger className="border-gray-200 focus:border-green-500">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pcs">pcs</SelectItem>
                                    <SelectItem value="g">g</SelectItem>
                                    <SelectItem value="ml">ml</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                            Save Changes
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditIngredientModal;
