import { usersClient } from "@/api/fetchClients";
import { User } from "@/types/authTypes";

const authService = {
    whoAmi: async (): Promise<User> => {
        return usersClient.GET("/whoami").then((result) => {
            if (result.response.ok && result.data?.userId) {
                return { userId: result.data.userId };
            }
            throw new Error("User not authorized");
        });
    },
};

export default authService;
