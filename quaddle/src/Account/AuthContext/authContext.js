// AuthProvider.js
import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const login = (userData) => {
        const { id, initials, logoColor, name, surname, username } = userData;
        const newUser = { id, initials, logoColor, name, surname, username };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        navigate('/login'); // Navigate to /login after logout

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
