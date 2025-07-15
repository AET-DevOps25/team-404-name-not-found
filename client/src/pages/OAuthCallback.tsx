import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const OAuthCallback = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        console.log("OAuthCallback: mounted");

        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
            console.log("OAuthCallback: token found, logging in with token.");
            login(token)
                .then(() => navigate("/dashboard"))
                .catch(() => navigate("/"));
        } else {
            console.error("OAuthCallback: no token found in URL parameters.");
            navigate("/");
        }
    }, []);

    return <p>Logging you in...</p>;
};

export default OAuthCallback;
