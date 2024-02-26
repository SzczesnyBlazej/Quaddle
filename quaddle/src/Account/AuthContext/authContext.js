// AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import API_ENDPOINTS from '../../ApiEndpoints/apiConfig';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const fetchUserData = async (accessToken) => {
    try {
        const response = await axios.get(`${API_ENDPOINTS.USER_MANAGEMENT}get_user_data_by_token`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        const user = response.data;
        return { isAuthenticated: true, user };
    } catch (error) {
        return { isAuthenticated: false, user: null };
    }
};

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState(() => {
        const accessToken = Cookies.get('access_token');
        if (accessToken) {
            return fetchUserData(accessToken);
        } else {
            return { isAuthenticated: false, user: null };
        }
    });

    const navigate = useNavigate();

    const login = async (username, password) => {
        try {
            const response = await axios.post(
                `${API_ENDPOINTS.USER_MANAGEMENT}login/`,
                { username, password },
                { headers: { 'Content-Type': 'application/json' } }
            );
            Cookies.set('access_token', response.data.access_token, { expires: 7 });
            Cookies.set('refresh_token', response.data.refresh_token, { expires: 7 });
            setAuthState({
                isAuthenticated: true,
                user: response.data.user,
            });
        } catch (error) {
            console.error('Login Error:', error);
            throw new Error('Invalid login credentials');
        }
    };

    const logout = () => {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');

        setAuthState({
            isAuthenticated: false,
            user: null,
        });

        navigate('/login');
    };

    useEffect(() => {
        const accessToken = Cookies.get('access_token');
        if (accessToken) {
            fetchUserData(accessToken)
                .then((userData) => {
                    setAuthState(userData);
                })
                .catch((error) => {
                    console.error('Error fetching user data:', error);
                    logout();
                });
        }
    }, []);


    return (
        <AuthContext.Provider value={{ login, logout, authState }}>
            {children}
        </AuthContext.Provider>
    );
};
