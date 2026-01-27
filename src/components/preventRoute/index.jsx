import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

function PrivateRoute() {
  const token = Cookies.get("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  try {
    return <Outlet />;
  } catch (error) {
    Cookies.remove("token");
    return <Navigate to="/login" replace />;
  }
}

export default PrivateRoute;
