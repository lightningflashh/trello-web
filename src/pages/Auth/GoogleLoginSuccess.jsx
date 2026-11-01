import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchCurrentUserAPI } from "~/apis";
import { setCurrentUser } from "~/redux/user/userSlice";
import { toast } from "react-toastify";
import PageLoadingSpinner from "~/components/Loading/PageLoadingSpinner";

const GoogleLoginSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await fetchCurrentUserAPI();

        // Update Redux user state
        dispatch(setCurrentUser(user));

        toast.success("Login successful");

        // Navigate to Board
        navigate("/", { replace: true });
      } catch (error) {
        toast.error("Failed to fetch user data. Please log in again.");
        navigate("/login", { replace: true });
      }
    };

    fetchUser();
  }, [dispatch, navigate]);

  return <PageLoadingSpinner caption="Logging in..." />;
};

export default GoogleLoginSuccess;