/**
 * @file Signup.jsx
 * @description
 * React component that provides a registration interface for new users.
 * It allows users to create an account by submitting personal details such as
 * first name, last name, email, password, and proficiency level (Frontend, Backend, or Both).
 * 
 * Upon successful registration, the data is sent to the backend API for account creation.
 * The user is then shown success or error toasts depending on the response.
 * 
 * This file contains two main components:
 *  - `RightPane`: Handles the sign-up form, state management, and API integration.
 *  - `SignUp`: Wrapper component that combines the left informational pane and the signup form.
 * 
 * @author Pranav Singh
 */

import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { User, Mail, Lock, Layers } from "lucide-react";
import LeftPane from "./LeftPane.jsx";
import ErrorToast from "../toasts/ErrorToast.jsx";
import SuccessToast from "../toasts/SuccessToast.jsx";

/**
 * @component RightPane
 * @description
 * Handles user registration logic, form validation, and backend integration.
 *  - Accepts user details (name, email, password, proficiency).
 *  - Sends registration data to backend API endpoint.
 *  - Displays success or error toast based on response.
 *  - Clears input fields after successful submission.
 */
function RightPane() {
  /** --------------------------- State Management --------------------------- */
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [prof, setProf] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [created, setCreated] = useState(false);

  /** ------------------------------------------------------------------------
   * @function postData
   * @description
   * Prepares and sends user registration data to the backend API.
   * Depending on the `prof` field, sets the user's proficiency type
   * (Frontend, Backend, or Both).
   * 
   * On success - clears form and displays success toast.  
   * On failure - displays error toast.
   * ------------------------------------------------------------------------ */
  const postData = async () => {
    let front = false;
    let back = false;

    if (prof === "frontend") front = true;
    else if (prof === "backend") back = true;
    else {
      front = true;
      back = true;
    }

    const body = {
      firstname: fname,
      lastname: lname,
      email: username,
      password: password,
      frontend: front,
      backend: back,
    };

    try {
      await axios.post("http://127.0.0.1:8000/api/accounts/", body);
      setError(false);
      setFname("");
      setLname("");
      setProf("");
      setUsername("");
      setPassword("");
      setCreated(true);
    } catch (err) {
      setCreated(false);
      setError(true);
      console.error("Error creating account:", err);
    }
  };

  /** ------------------------------------------------------------------------
   * @function handleSubmit
   * @description
   * Prevents default form reload and triggers API submission.
   * @param {Event} event - Form submission event
   * ------------------------------------------------------------------------ */
  const handleSubmit = async (event) => {
    event.preventDefault();
    await postData();
  };

  /** ------------------------------------------------------------------------
   * @function closePopUp
   * @description Closes success/error toast popups when dismissed.
   * ------------------------------------------------------------------------ */
  const closePopUp = () => {
    setError(false);
    setCreated(false);
  };

  /** --------------------------- Input Handlers --------------------------- */
  const handleFname = (e) => setFname(e.target.value);
  const handleLname = (e) => setLname(e.target.value);
  const handleUsername = (e) => setUsername(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleProf = (e) => setProf(e.target.value);

  /** --------------------------- JSX Structure --------------------------- */
  return (
    <div className="relative flex justify-center items-center w-full md:w-1/2 h-screen bg-gradient-to-br from-blue-200 via-blue-100 to-indigo-200 animate-gradient">
      <div className="w-full max-w-md bg-white/40 p-10 rounded-3xl shadow-2xl border border-gray-200">

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <Layers className="w-12 h-12 text-blue-600 mb-2 drop-shadow-md" />
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight text-center">
            SIGN UP
          </h1>
          <p className="text-gray-600 mt-1 text-sm text-center">
            Please fill all the necessary details.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* First & Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400 transition-colors duration-200 peer-focus:text-blue-600" />
              <input
                id="fname"
                type="text"
                value={fname}
                onChange={handleFname}
                required
                className="peer w-full pl-10 pr-3 py-3 bg-white/60 border border-gray-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-300 transition placeholder-transparent"
                placeholder="First Name"
              />
              <label
                htmlFor="fname"
                className={`absolute py-1 left-10 px-1 rounded text-gray-500 text-sm transition-all duration-200
                  ${fname ? "-top-2.5 text-xs text-blue-600" : "top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-blue-600"}`}
              >
                First Name
              </label>
            </div>

            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400 transition-colors duration-200 peer-focus:text-blue-600" />
              <input
                id="lname"
                type="text"
                value={lname}
                onChange={handleLname}
                required
                className="peer w-full pl-10 pr-3 py-3 bg-white/60 border border-gray-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-300 transition placeholder-transparent"
                placeholder="Last Name"
              />
              <label
                htmlFor="lname"
                className={`absolute py-1 left-10 px-1 rounded text-gray-500 text-sm transition-all duration-200
                  ${lname ? "-top-2.5 text-xs text-blue-600" : "top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-blue-600"}`}
              >
                Last Name
              </label>
            </div>
          </div>

          {/* Proficiency */}
          <div className="relative">
            <Layers className="absolute left-3 top-3 text-gray-400 transition-colors duration-200 peer-focus:text-blue-600" />
            <select
              id="prof"
              value={prof}
              onChange={handleProf}
              required
              className="peer w-full pl-10 pr-3 py-3 bg-white/60 border border-gray-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-300 transition"
            >
              <option value="">Select proficiency</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="both">Both</option>
            </select>
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400 transition-colors duration-200 peer-focus:text-blue-600" />
            <input
              id="email"
              type="email"
              value={username}
              onChange={handleUsername}
              required
              className="peer w-full pl-10 pr-3 py-3 bg-white/60 border border-gray-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-300 transition placeholder-transparent"
              placeholder="Email"
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
              onChange={handlePassword}
              required
              className="peer w-full pl-10 pr-3 py-3 bg-white/60 border border-gray-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-300 transition placeholder-transparent"
              placeholder="Password"
            />
            <label
              htmlFor="password"
              className={`absolute py-1 left-10 px-1 rounded text-gray-500 text-sm transition-all duration-200
                ${password ? "-top-2.5 text-xs text-blue-600" : "top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-blue-600"}`}
            >
              Password
            </label>
          </div>

          {/* Toasts */}
          {error && <ErrorToast error="Oops! This account already exists" onClose={closePopUp} />}
          {created && <SuccessToast message="Account Created! You can login now" onClose={closePopUp} />}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition duration-300 text-lg flex items-center justify-center gap-2"
          >
            <Layers className="w-5 h-5" /> CREATE ACCOUNT
          </button>
        </form>

        {/* Redirect to Sign In */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?
          <Link to="/" className="text-blue-600 hover:underline ml-1 font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

/**
 * @component SignUp
 * @description
 * Wrapper layout that displays the left informational pane (`LeftPane`)
 * and the right signup form (`RightPane`) side by side.
 *
 * @returns {JSX.Element} A responsive sign-up page layout.
 */
function SignUp() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <LeftPane />
      <RightPane />
    </div>
  );
}

export default SignUp;