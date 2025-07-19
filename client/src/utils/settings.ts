import { create } from "zustand";
import { persist } from "zustand/middleware";

const DEFAULT_NUMBER_OF_RECIPES = 3;

type SettingsState = {
    numberOfRecipesToGenerate: number;
    setNumberOfRecipes: (value: number) => void;
};

// Create the Zustand store once
const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            numberOfRecipesToGenerate: DEFAULT_NUMBER_OF_RECIPES,
            setNumberOfRecipes: (value) => set({ numberOfRecipesToGenerate: value }),
        }),
        {
            name: "app-settings",
        }
    )
);

export const getNumberOfRecipesToGenerate = () => useSettingsStore.getState().numberOfRecipesToGenerate;
export const setNumberOfRecipesToGenerate = (value: number) => useSettingsStore.getState().setNumberOfRecipes(value);
