import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './authContext';
import ifUserIsAdminBoolean from './ifUserIsAdminBoolean';
import { useNotification } from '../../Functions/NotificationContext';

const RouteGuard = ({ children }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
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
                setIsAdmin(userIsAdmin);

                if (!userIsAdmin) {
                    showNotification(`You don't have administrator rights`);

                    navigate('/');
                }
            } catch (error) {
                showNotification('Error checking admin status:' + error);

                console.error('Error checking admin status:', error);
            }
        };

        checkAdminStatus();
    }, [user, navigate, showNotification]);

    if (isAdmin === null) {
        showNotification('Error checking admin status, Admin is null'
        );
        // return <div>'Error checking admin status:', Admin is null</div>;
    }

    return isAdmin ? <>{children}</> : null;
};

export default RouteGuard;
