import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../context/AuthProvider.jsx";

export default function RequireAuth() {
  const { user } = useContext(AuthContext);

  return user ? <Outlet /> : <Navigate to="/" replace />;
}
