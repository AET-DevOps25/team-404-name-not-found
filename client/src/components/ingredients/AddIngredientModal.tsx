import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Ingredient } from "@/types/ingredientTypes";

interface AddIngredientModalProps {
    onClose: () => void;
    onAdd: (ingredient: Ingredient) => void;
}

const AddIngredientModal = ({ onClose, onAdd }: AddIngredientModalProps) => {
    const [formData, setFormData] = useState({
        name: "",
        quantity: "",
        unit: "pcs" as const,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.quantity) return;

        onAdd({
            name: formData.name,
            quantity: parseInt(formData.quantity),
            unit: formData.unit,
        });

        setFormData({ name: "", quantity: "", unit: "pcs" });
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-md [&>button]:hidden">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Add Ingredient</DialogTitle>
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
                            Add Ingredient
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddIngredientModal;
