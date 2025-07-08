import { usersClient } from "@/api/fetchClient.ts";
import { User } from '@/types/authTypes';

const authService = {
    whoAmi: async (): Promise<User> => {
        return usersClient.GET("/whoami", {
            params: {
                header: {
                    "X-User-Id": ""
                }
            },
        }).then((result) => {
            if (result.response.ok && result.data?.userId) {
                return {userId: result.data.userId};
            }
            throw new Error("User not authorized")
        })
    }
}

export default authService;
