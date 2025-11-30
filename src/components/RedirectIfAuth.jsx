import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../context/AuthProvider.jsx";

export default function RedirectIfAuth() {
  const { user } = useContext(AuthContext);

  return user ? <Navigate to="/home" replace /> : <Outlet />;
}