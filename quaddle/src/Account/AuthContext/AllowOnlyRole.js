// AllowOnlyRole.js
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
        const fetchData = async () => {
            try {
                const hasAccess = roles.some(role => {
                    if (role === 'admin') {
                        return user.is_admin;
                    } else if (role === 'solver') {
                        return user.is_solver;
                    }
                    return false;
                });

                const allowOnlyAdmin = onlyAdmin && user.is_admin;

                if (hasAccess || allowOnlyAdmin) {
                    setIsAuthorized(true);
                } else if (taskId) {
                    const taskResponse = await axios.get(API_ENDPOINTS.TASK_API + `/${taskId}`);
                    const task = taskResponse.data;

                    const isAuthorizedUser = task && task.customerId === user.id;
                    setIsAuthorized(isAuthorizedUser);
                } else {
                    setIsAuthorized(false);
                }
            } catch (e) {
                showNotification('Error fetching user or task:', e);
            }
        };

        fetchData();
    }, [showNotification, roles, onlyAdmin]);

    return isAuthorized ? <>{children}</> : null;
};

export default AllowOnlyRole;
