import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNotification } from '../../Functions/NotificationContext';
import API_ENDPOINTS from "../../ApiEndpoints/apiConfig";
import { useAuth } from './authContext';

const AllowOnlyRole = ({ children, roles = [], taskId = null, onlyAdmin = false }) => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const showNotification = useNotification();
    const { authState } = useAuth();
    const user = authState.user;

    useEffect(() => {
        const checkAuthorization = async () => {
            try {
                let authorized = roles.some(role => {
                    if (role === 'admin') return user?.is_admin;
                    if (role === 'solver') return user?.is_solver;
                    return false;
                });

                if (!authorized && onlyAdmin) {
                    authorized = user?.is_admin;
                }

                if (!authorized && taskId) {
                    const { data: task } = await axios.get(`${API_ENDPOINTS.TASK_API}/${taskId}`);
                    authorized = task?.customerId === user?.id;
                }

                setIsAuthorized(authorized);
            } catch (error) {
                showNotification('Error fetching user or task: ' + error.message);
            }
        };

        checkAuthorization();
    }, [roles, onlyAdmin, taskId, showNotification, user]);

    return isAuthorized ? <>{children}</> : null;
};

export default AllowOnlyRole;
