import {createContext, useState} from "react";

const AuthContext = createContext();

const AuthProvider = ({children}) => {
  const [user,setUser] = useState(null);
  const [authToken,setAuthTokens] = useState(null);

  const loginUser = (data) => {
    setUser(data);
  }

  return(
    <AuthContext.Provider value = {{user,setAuthTokens,loginUser}}>
      {children}
    </AuthContext.Provider>
  )
}

export {AuthProvider,AuthContext};

// import { createContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const AuthContext = createContext();
// export default AuthContext;

// export const AuthProvider = ({ children }) => {
//   const navigate = useNavigate();
//   const [user,setUser] = useState();
//   const [authTokens, setAuthTokens] = useState();
//   // Initialise from localStorage
//   // const [authTokens, setAuthTokens] = useState(() =>
//   //   localStorage.getItem("access_token") ? localStorage.getItem("access_token") : null
//   // );
//   // const [user, setUser] = useState(() =>
//   //   localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null
//   // );

//   // Login: store tokens & user data
//   const loginUser = (tokens, userData) => {
//     localStorage.setItem("access_token", tokens.access);
//     localStorage.setItem("refresh_token", tokens.refresh);
//     localStorage.setItem("user", JSON.stringify(userData));

//     setAuthTokens(tokens.access);
//     setUser(userData);
//     navigate("/home");
//   };

//   // Logout: clear everything
//   const logoutUser = () => {
//     localStorage.removeItem("access_token");
//     localStorage.removeItem("refresh_token");
//     localStorage.removeItem("user");

//     setAuthTokens(null);
//     setUser(null);
//     navigate("/");
//   };

//   // Listen for changes in localStorage (other tabs)
//   useEffect(() => {
//     const handleStorage = (e) => {
//       if (e.key === "access_token" && !e.newValue) {
//         // Someone cleared token in another tab
//         logoutUser();
//       }
//     };
//     window.addEventListener("storage", handleStorage);
//     return () => window.removeEventListener("storage", handleStorage);
//   }, []);

//   const contextData = {
//     user,
//     authTokens,
//     loginUser,
//     logoutUser,
//     setUser,
//     setAuthTokens,
//   };

//   return <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>;
// };