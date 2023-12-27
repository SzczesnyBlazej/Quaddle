// AllowOnlyRole.js
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { getUserFromLocalStorage } from "./getUserFromLocalStorage";
import { useNotification } from '../../Functions/NotificationContext';
import API_ENDPOINTS from "../../ApiEndpoints/apiConfig";

const AllowOnlyRole = ({ children, roles = [], taskId = null }) => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const showNotification = useNotification();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const loggedInUser = getUserFromLocalStorage();
                const response = await axios.get(API_ENDPOINTS.USERS + `/${loggedInUser}`);
                const user = response.data;

                const hasAccess = roles.some(role => {
                    if (role === 'admin') {
                        return user.isAdmin;
                    } else if (role === 'solver') {
                        return user.isSolver;
                    }
                    return false;
                });

                if (hasAccess) {
                    setIsAuthorized(true);
                } else if (taskId) {
                    const taskResponse = await axios.get(API_ENDPOINTS.TASKS + `/${taskId}`);
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
    }, [showNotification, roles, taskId]);

    return isAuthorized ? <>{children}</> : null;
};

export default AllowOnlyRole;
