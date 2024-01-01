// AuthProvider.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const SESSION_TIMEOUT = 10 * 60 * 1000;

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    useEffect(() => {
        const checkSessionTimeout = () => {
            const lastActivityTime = localStorage.getItem('lastActivityTime');

            if (lastActivityTime) {
                const currentTime = new Date().getTime();
                const elapsedTime = currentTime - parseInt(lastActivityTime, 10);

                if (elapsedTime > SESSION_TIMEOUT) {
                    logout();
                    navigate('/login');
                }
            }
        };

        checkSessionTimeout();

        const intervalId = setInterval(checkSessionTimeout, 60000);

        return () => clearInterval(intervalId);
    }, [navigate]);

    const login = (userData) => {
        const { id, initials, logoColor, name, surname, username, email, phone } = userData;
        const newUser = { id, initials, logoColor, name, surname, username, email, phone };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        localStorage.setItem('lastActivityTime', new Date().getTime().toString());
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('suggestions');
        sessionStorage.removeItem('searchValue');
        localStorage.removeItem('lastActivityTime');

        localStorage.removeItem('user');
        navigate('/login');
    };

    const isAuthenticated = () => !!user;

    const contextValue = {
        user,
        login,
        logout,
        isAuthenticated,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {localStorage.setItem('lastActivityTime', new Date().getTime().toString())}

            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};
