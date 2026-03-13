import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const useValidateUser = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const validate = async () => {
      let storedUser;
      try {
        const rawUser = localStorage.getItem("user");
        if (!rawUser) return;
        storedUser = JSON.parse(rawUser);
      } catch {
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("userUpdated"));
        navigate("/");
        return;
      }

      const userId = storedUser?.id?.toString().trim();
      if (!userId) return;

      try {
        await api.get(`/User/validate_user/${userId}`, { timeout: 8000 });
      } catch (err) {
        if (cancelled) return;
        if (err.response && (err.response.status === 401 || err.response.status === 404)) {
          localStorage.removeItem("user");
          window.dispatchEvent(new Event("userUpdated"));
          navigate("/");
        }
      }
    };

    validate();

    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useValidateUser;
