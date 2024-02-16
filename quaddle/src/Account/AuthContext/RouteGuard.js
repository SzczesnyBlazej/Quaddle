import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './authContext';
import { useNotification } from '../../Functions/NotificationContext';

const RouteGuard = ({ children, onlyAdmin = false }) => {
    const { authState } = useAuth();
    const user = authState.user;
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSolver, setIsSolver] = useState(false);

    const showNotification = useNotification();

    useEffect(() => {
        const checkAdminStatus = async () => {
            if (!user) {
                showNotification('Log in to check content');
                navigate('/');
                return;
            }

            try {
                const userIsAdmin = user.is_admin;
                const userIsSolver = user.is_solver;
                setIsAdmin(userIsAdmin);
                setIsSolver(userIsSolver);

                if (onlyAdmin && !userIsAdmin) {
                    showNotification(`You don't have administrator rights`);
                    navigate('/');
                }

                if (!onlyAdmin && !(userIsAdmin || userIsSolver)) {
                    showNotification(`You don't have administrator or solver rights`);
                    navigate('/');
                }
            } catch (error) {
                showNotification('Error checking status:' + error);
            }
        };

        checkAdminStatus();
    }, [user, navigate, showNotification, onlyAdmin]);

    if (isAdmin === null || isSolver === null) {
        showNotification('Error checking admin status, roles are null');
    }

    return (onlyAdmin ? isAdmin : isAdmin || isSolver) ? <>{children}</> : null;
};

export default RouteGuard;
