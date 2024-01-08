// AuthProvider.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [sessionConfig, setSessionConfig] = useState([{ id: 1, enable: true, session_timeout: 10 }]);

    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    useEffect(() => {
        const fetchSessionConfig = async () => {
            try {
                const response = await axios.get('http://localhost:3507/enableSessionTimeout');
                setSessionConfig(response.data);
            } catch (error) {
                console.error('Error fetching session config:', error);

            }
        };

        fetchSessionConfig();
    }, []);
    useEffect(() => {
        const checkSessionTimeout = () => {
            const lastActivityTime = localStorage.getItem('lastActivityTime');

            if (lastActivityTime) {
                const currentTime = new Date().getTime();
                const elapsedTime = currentTime - parseInt(lastActivityTime, 10);

                const SESSION_TIMEOUT = sessionConfig[0].session_timeout * 60 * 1000;
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
        const { id, initials, logoColor, name, surname, username, email, phone, unit } = userData;
        const newUser = { id, initials, logoColor, name, surname, username, email, phone, unit };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        localStorage.setItem('lastActivityTime', new Date().getTime().toString());
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('lastActivityTime');
        localStorage.removeItem('suggestions');
        sessionStorage.removeItem('searchValue');
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
