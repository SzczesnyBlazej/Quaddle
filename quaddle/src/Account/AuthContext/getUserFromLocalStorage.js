const getUserFromLocalStorage = () => {
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    return user ? user.id : null;
};

export { getUserFromLocalStorage };
