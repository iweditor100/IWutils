import GoogleLoginButton from "../components/GoogleLoginButton";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-md text-center border border-gray-200">
        
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Login/Signup
        </h2>

        <p className="text-gray-600 mb-8">
          Sign in to continue to your dashboard
        </p>

        <div className="flex justify-center">
          <GoogleLoginButton />
        </div>

        <p className="text-sm text-gray-400 mt-8">
          This will upload your data provided by google to our database. 

        </p>
      </div>
    </div>
  );
}
