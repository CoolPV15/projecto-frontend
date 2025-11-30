/**
 * @file AuthProvider.jsx
 * @description
 * Global authentication context that stores the logged-in user's details
 * and JWT tokens. It restores authentication state from localStorage on page
 * refresh and provides helper functions to update login status.
 * 
 * This context is used throughout the application to check whether the
 * user is authenticated and to fetch/store user data consistently.
 * 
 * @author Pranav Singh
 */

import { createContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  /** Stores user info returned from backend */
  const [user, setUser] = useState(null);

  /** Stores access and refresh tokens */
  const [authToken, setAuthTokens] = useState(() => {
    const access = localStorage.getItem("access_token");
    const refresh = localStorage.getItem("refresh_token");

    return access && refresh ? { access, refresh } : null;
  });

  /**
   * @function loginUser
   * @description Saves authenticated user data in context.
   */
  const loginUser = useCallback((data) => {
    setUser(data);
  }, []);


  /**
   * @function logoutUser
   * @description Clears user data and tokens fully.
   */
  const logoutUser = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.setItem("islogged", "false");

    setAuthTokens(null);
    setUser(null);
  };

  /**
   * @function useEffect
   * @description Restores user and token data from localStorage
   * when the browser is refreshed.
   */
  useEffect(() => {
    const access = localStorage.getItem("access_token");
    const refresh = localStorage.getItem("refresh_token");

    if (access && refresh) {
      setAuthTokens({ access, refresh });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        authToken,
        loginUser,
        setAuthTokens,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };