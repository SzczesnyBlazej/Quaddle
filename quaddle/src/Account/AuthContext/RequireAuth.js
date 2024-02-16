import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import API_ENDPOINTS from '../../ApiEndpoints/apiConfig';
import { useNotification } from '../../Functions/NotificationContext';
const RequireAuth = ({ children }) => {
    const navigate = useNavigate();
    const [isValidToken, setIsValidToken] = useState(false);
    const showNotification = useNotification();

    useEffect(() => {
        const checkTokenValidity = async () => {
            const accessToken = Cookies.get('access_token');
            if (accessToken) {
                try {
                    const response = await axios.get(`${API_ENDPOINTS.USER_MANAGEMENT}validate_token`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    });
                    setIsValidToken(true);
                } catch (error) {
                    setIsValidToken(false);

                    navigate('/login');
                    showNotification('Sign in to view content');


                }
            } else {
                setIsValidToken(false);

                navigate('/login');
                showNotification('Sign in to view content');

            }
        };

        checkTokenValidity();
    }, [navigate]);

    return isValidToken ? <>{children}</> : null;
};

export default RequireAuth;
