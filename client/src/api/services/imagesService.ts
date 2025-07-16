import { imagesClient } from "@/api/fetchClients";
import { Ingredient } from "@/types/ingredientTypes";

class ImagesService {
    async analyzeIngredients(file: File): Promise<Ingredient[]> {
        const formData = new FormData();
        formData.append("file", file);

        const result = await imagesClient.POST("/ingredients", {
            body: formData as any,
        });
        console.log(result);
        const errorMessageHeader = "Failed to analyze ingredients";
        if (!result.response.ok) {
            const errorMessage = `${errorMessageHeader}: response is not OK: ${result.response.status} ${result.response.statusText}`;
            console.error(errorMessage, result.data);
            throw new Error(errorMessage);
        }
        if (!result.data) {
            throw new Error(`${errorMessageHeader}: response has no data`);
        }

        return result.data.map((ingredient) => ({
            name: ingredient.name,
            quantity: ingredient.amount,
            unit: ingredient.unit,
        }));
    }
}

const imagesService = new ImagesService();
export default imagesService;
