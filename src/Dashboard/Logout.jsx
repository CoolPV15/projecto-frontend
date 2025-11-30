/**
 * @file Logout.jsx
 * @description React component that handles logout when the user clicks on the logout button
 * on the sidebar
 * @author Pranav Singh
 */

import React from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../Interceptors/axiosInstance';

/**
 * @components Logout
 * @description
 * This component provides users to manually logout from their account by removing the
 * access and refresh tokens from the local storage and setting the variable "islogged" 
 * to false.
 */

function Logout() {
    /** --------------------- STATE MANAGEMENT -------------------------- */
    const navigate = useNavigate();

    /**
     * @function handleLogOut
     * @description Removes the access and refresh tokens from the local storage and set
     * the value of variable "islogged" to false, while navigating user back to the sign
     * in tab.
     */
    const handleLogOut = async () => {
        // Capturing the refresh token
        const refresh_token = localStorage.getItem("refresh_token");
        localStorage.setItem("islogged","false");

        if (!refresh_token) {
            // If no token is set, clearing the localStorage and redirecting to the login page
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.setItem("islogged","false");
            delete axiosInstance.defaults.headers["Authorization"];
            navigate("/");
            return;
        }   

        try {
            // Calling the logout API only if refresh token exists
            await axiosInstance.post("accounts/logout/", { refresh_token });

            // Clearing the tokens after successful logout
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.setItem("islogged","false");
            delete axiosInstance.defaults.headers["Authorization"];

            navigate("/");
        } catch (error) {
            console.log("Logout Failed", error.response?.data || error);

            // Even if logout API fails, clearing the tokens and redirecting to the login page
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.setItem("islogged","false");
            delete axiosInstance.defaults.headers["Authorization"];

            navigate("/");
        }
    };

    return(
        <button className="w-full" onClick = {handleLogOut}>Logout</button>
    );
}

export default Logout