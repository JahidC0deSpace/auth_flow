import React, { useState } from "react";
import {
  getAuth,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Replace this with your actual firebase config export if you have one
// import { auth } from "../firebaseConfig";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth(); // Or use your imported auth instance

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Check if the user exists by fetching their sign-in methods
      // Note: This requires "Email Enumeration Protection" to be DISABLED in Firebase Console
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);

      if (signInMethods.length === 0) {
        // 2. If the array is empty, the user does not exist in Auth
        toast.error("Error: No account found with this email address.");
      } else {
        // 3. User exists, proceed with sending the reset email
        await sendPasswordResetEmail(auth, email);
        toast.success("Success! Check your email for the reset link.");
        navigate("/login");
      }
    } catch (error) {
      // Handle potential errors (e.g., invalid email format or network issues)
      if (error.code === "auth/invalid-email") {
        toast.error("Please enter a valid email address.");
      } else {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Reset Password
        </h2>

        <p className="text-gray-600 text-sm text-center mb-6">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "Checking..." : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
          >
            &larr; Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
