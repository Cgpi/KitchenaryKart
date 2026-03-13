export const getStoredUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

export const setStoredUser = (userData) => {
  localStorage.setItem("user", JSON.stringify(userData));
};

export const removeStoredUser = () => {
  localStorage.removeItem("user");
};
