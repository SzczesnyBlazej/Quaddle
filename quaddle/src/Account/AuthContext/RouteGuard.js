import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './authContext';
import ifUserIsAdminBoolean from './ifUserIsAdminBoolean';
import { useNotification } from '../../Functions/NotificationContext';
import ifUserIsSolverBoolean from './ifUserIsSolverBoolean';

const RouteGuard = ({ children }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSolver, setIsSolver] = useState(false); // Zmiana nazwy stanu

    const showNotification = useNotification();

    useEffect(() => {
        const checkAdminStatus = async () => {
            if (!user) {
                showNotification('Log in to check content');
                navigate('/');
                return;
            }

            try {
                const userIsAdmin = await ifUserIsAdminBoolean(user.id);
                const userIsSolver = await ifUserIsSolverBoolean(user.id);
                setIsAdmin(userIsAdmin);
                setIsSolver(userIsSolver); // Ustawienie wartości dla isSolver
                if (!(userIsAdmin || userIsSolver)) {
                    showNotification(`You don't have administrator or solver rights`);
                    navigate('/');
                }
            } catch (error) {
                showNotification('Error checking status:' + error);
            }
        };

        checkAdminStatus();
    }, [user, navigate, showNotification]);

    if (isAdmin === null || isSolver === null) {
        showNotification('Error checking admin status, roles are null');
    }
    // console.log(isAdmin, isSolver)
    return isAdmin || isSolver ? <>{children}</> : null;
};

export default RouteGuard;
