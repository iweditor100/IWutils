import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "../hooks/authHook";

const backendURL = import.meta.env.VITE_BACKEND_API;
export default function GoogleLoginButton() {
    const {loginUser} = useAuth();
    


    useEffect(() => {
        const scriptId = "google-gsi";
        if (!document.getElementById(scriptId)) {
            const script = document.createElement("script");
            script.src = "https://accounts.google.com/gsi/client";
            script.async = true;
            script.defer = true;
            script.id = scriptId;
            document.body.appendChild(script);

            script.onload = initGoogle;
        } else {
            initGoogle();
        }
    }, []);

    
    const initGoogle = () => {
        /* global google */
        if (!window.google) return;

        google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleGoogleLogin,
        });

        google.accounts.id.renderButton(
            document.getElementById("googleBtn"),
            { theme: "filled_blue", size: "large" }
        );
    };

    const handleGoogleLogin = async (response) => {

        console.log("Google call back triggered!");
        try {
            const res = await axios.post(
                `${backendURL}/auth/google`,
                { credential: response.credential },
                { withCredentials: true }
            );

            loginUser({
                user: res.data.user,
                accessToken: res.data.accessToken,
            });

            alert("Login successful!");
        } catch (err) {
            console.error(err);
            alert("Login failed");
        }
    };

    return <div id="googleBtn"></div>;
}