import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './authContext';
import ifUserIsAdminBoolean from './ifUserIsAdminBoolean';
import { useNotification } from '../../Functions/NotificationContext';
import ifUserIsSolverBoolean from './ifUserIsSolverBoolean';

const RouteGuard = ({ children, onlyAdmin = false }) => {
    const { user } = useAuth();
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
                const userIsAdmin = await ifUserIsAdminBoolean(user.id);
                const userIsSolver = await ifUserIsSolverBoolean(user.id);
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
