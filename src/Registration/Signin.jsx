/**
 * @file Signin.jsx
 * @description
 * React component that provides a sign-in interface for registered users.
 * It authenticates user credentials against the backend API and grants access
 * to the dashboard upon successful login. The component securely stores
 * authentication tokens, manages login state, and redirects authenticated users.
 * 
 * This file contains two components:
 *  - `RightPane`: The main sign-in form logic and dynamic UI.
 *  - `Signin`: A wrapper that combines the left informational pane and the right login form.
 * 
 * @author Pranav
 */

import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Users, Key } from "lucide-react";
import LeftPane from "./LeftPane.jsx";
import ErrorToast from "../toasts/ErrorToast";
import axiosInstance from "../Interceptors/axiosInstance";
import { AuthContext } from "../context/AuthProvider.jsx";

/**
 * @component RightPane
 * @description
 * Handles user authentication for existing accounts.
 * Offers input fields for email and password, validates credentials,
 * and navigates users to the dashboard upon successful login.
 */
function RightPane() {
  /** --------------------------- State Management --------------------------- */
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);


/** ------------------------------------------------------------------------ 
 * @function useEffect 
 * @description Redirects users to the home dashboard if already logged in. 
 * ------------------------------------------------------------------------ */
  useEffect(() => {
    if (localStorage.getItem("islogged") === "true") navigate("home");
  }, []);

/** ------------------------------------------------------------------------ 
 * @function useEffect
 * @description 
 * Listens for changes in localStorage to synchronize login status across tabs.
 * Automatically redirects to home if login occurs elsewhere.
 * ------------------------------------------------------------------------ */
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "islogged" && e.newValue === "true") navigate("home");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

/** ------------------------------------------------------------------------
 * @function authenticateData 
 * @description 
 * Sends user credentials (email and password) to the backend API for authentication. 
 * On success, stores access and refresh tokens in localStorage and updates 
 * the global authentication context. 
 * 
 * On failure, displays an error message. 
 *  ------------------------------------------------------------------------ */
  const authenticateData = async () => {
    try {
      const { data } = await axiosInstance.post("token/", {
        email: username,
        password: password,
      });
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("islogged", "true");

      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${data.access}`;
      loginUser({
        user: { email: username }, 
        access: data.access,
        refresh: data.refresh
      });

      navigate("home");
    } catch (err) {
      setError("Invalid Credentials");
      console.error(err);
    }
  };

/** ------------------------------------------------------------------------
 * @function handleSubmit
 * @description 
 * Handles the login form submission, prevents page reload, and triggers user authentication.
 *
 * @param {Event} event - Form submission event
 * ------------------------------------------------------------------------ */
  const handleSubmit = (e) => {
    e.preventDefault();
    authenticateData();
  };

/** ------------------------------------------------------------------------
 * @function closePopUp
 * @description Closes the error toast popup when dismissed. 
 * ------------------------------------------------------------------------ */
  const closePopUp = () => setError("");

  return (
    <div className="relative flex justify-center items-center w-full md:w-1/2 h-screen bg-gradient-to-br from-blue-200 via-blue-100 to-indigo-200 animate-gradient">

      {/* Card */}
      <div className="backdrop-blur-xl bg-white/40 border border-white/20 shadow-2xl rounded-3xl p-10 w-full max-w-md">

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <Users className="w-12 h-12 text-blue-700 mb-2 drop-shadow-md" />
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight text-center">
            SIGN IN
          </h1>
          <p className="text-gray-600 mt-1 text-sm text-center">
            Enter your credentials to access your dashboard.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-7">

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400 transition-colors duration-200 peer-focus:text-blue-600" />
            <input
              id="email"
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="peer w-full pl-10 pr-3 py-3 bg-white/60 border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-300 rounded-xl outline-none transition"
              autoComplete="on"
            />
            <label
              htmlFor="email"
              className={`absolute py-1 left-10 px-1 rounded text-gray-500 text-sm transition-all duration-200
                          ${username ? "-top-2.5 text-xs text-blue-600" : "top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-blue-600"}`}
            >
              Email
            </label>
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400 transition-colors duration-200 peer-focus:text-blue-600" />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="peer w-full pl-10 pr-3 py-3 bg-white/60 border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-300 rounded-xl outline-none transition"
            />
            <label
              htmlFor="password"
              className={`absolute py-1 left-10 px-1 rounded text-gray-500 text-sm transition-all duration-200
                          ${password ? "-top-2.5 text-xs text-blue-600" : "top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-blue-600"}`}
            >
              Password
            </label>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white tracking-wide font-semibold rounded-xl shadow-lg flex items-center justify-center gap-2 transition hover:shadow-2xl text-lg"
          >
            <Key className="w-5 h-5" /> Sign In
          </button>
        </form>

        {/* Signup Link */}
        <p className="mt-6 text-center text-sm text-gray-700">
          New here?
          <Link to="/signup" className="ml-1 text-blue-700 font-medium hover:underline">
            Create an account
          </Link>
        </p>
      </div>
        {/* Error Toast */}
        {error && ( <div className="mt-4"> <ErrorToast error={error} onClose={closePopUp} /> </div> )}
    </div>
  );
}

/**
 * @component Signin
 * @description
 * Wrapper component that combines the left informational pane
 * (`LeftPane`) and the right login form (`RightPane`).
 *
 * @returns {JSX.Element} A responsive layout containing both panes.
 */
function Signin() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <LeftPane />
      <RightPane />
    </div>
  );
}

export default Signin;