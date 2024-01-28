export const isUserAuthenticated = () => {
    const token = sessionStorage.getItem("token");
    return token !== null;
  };