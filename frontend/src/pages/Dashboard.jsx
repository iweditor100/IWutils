import { useAuth } from "../hooks/authHook";
import axiosClient from "../utils/axiosClient";

export default function Dashboard() {
    const {user, logoutUser} = useAuth();

    const handleLogout = async() => {
        await axiosClient.post("/auth/logout");
        logoutUser();
    }

    return (
        <div>
            <h1>Welcome, {user?.name}</h1>
            <img src={user.picture} alt="userImageFromGoogle" />

            <button onClick={handleLogout}>
                Logout
            </button>
        </div>
    )
}