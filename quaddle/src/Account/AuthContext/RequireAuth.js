// RequireAuth.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import API_ENDPOINTS from '../../ApiEndpoints/apiConfig';
import { useNotification } from '../../Functions/NotificationContext';

const RequireAuth = ({ children }) => {
    const navigate = useNavigate();
    const showNotification = useNotification();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkTokenValidity = async () => {
            const accessToken = Cookies.get('access_token');
            if (accessToken) {
                try {
                    const response = await axios.get(`${API_ENDPOINTS.USER_MANAGEMENT}validate_token/`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    });
                    setLoading(false);
                } catch (error) {
                    console.error('Token validation error:', error);
                    navigate('/login');
                    showNotification('Sign in to view content');
                    setLoading(false);
                }
            } else {
                setLoading(false);
                navigate('/login');
                showNotification('Sign in to view content');
            }
        };

        checkTokenValidity();
    }, [navigate, showNotification]);

    return loading ? null : <>{children}</>;
};

export default RequireAuth;
