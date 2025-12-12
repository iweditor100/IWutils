import { useAuth } from "../hooks/authHook";
import axiosClient from "../utils/axiosClient";

export default function Dashboard() {
    const {user, logoutUser} = useAuth();

    const handleLogout = async() => {
        await axiosClient.post("/auth/logout");
        logoutUser();
    }

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-start py-20 px-4">
            <div className="bg-white shadow-xl rounded-xl p-8 max-w-md w-full text-center">

                <div className="flex flex-col items-center gap-4">
                    
                    <img 
                        src={user?.picture}
                        alt="User avatar"
                        className="w-28 h-28 rounded-full shadow-md border"
                    />

                    <h1 className="text-2xl font-semibold text-gray-800">
                        Welcome, <span className="text-blue-600">{user?.name}</span>
                    </h1>

                    <p className="text-gray-500">{user?.email}</p>
                </div>

                <div className="mt-8">
                    <button
                        onClick={handleLogout}
                        className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all shadow-md"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    )
}


