import { usersClient } from "@/api/fetchClients";
import { User } from "@/types/authTypes";

class AuthService {
    async whoAmI(): Promise<User> {
        const result = await usersClient.GET("/whoami");

        if (!result.response.ok) {
            throw new Error("User not authorized");
        }
        if (!result.data) {
            throw new Error("No user data returned");
        }

        return { userId: result.data.userId };
    }
}

const authService = new AuthService();
export default authService;
