// AllowOnlyAdmin.js
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { getUserFromLocalStorage } from "./getUserFromLocalStorage";
import { useNotification } from '../../Functions/NotificationContext';
import API_ENDPOINTS from "../../ApiEndpoints/apiConfig";

const AllowOnlyAdmin = ({ children, taskId = null }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const showNotification = useNotification();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const loggedInUser = getUserFromLocalStorage();
                const response = await axios.get(API_ENDPOINTS.USERS + `/${loggedInUser}`);
                const user = response.data;
                const userIsAdmin = user && user.isAdmin;
                setIsAdmin(userIsAdmin);

                if (taskId) {
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
    }, [showNotification, taskId]);

    return (isAdmin || isAuthorized) ? <>{children}</> : null;
};

export default AllowOnlyAdmin;
