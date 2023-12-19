// AllowOnlyAdmin.js
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { getUserFromLocalStorage } from "./getUserFromLocalStorage";
import { useNotification } from '../../Functions/NotificationContext';
import API_ENDPOINTS from "../../ApiEndpoints/apiConfig";

const AllowOnlyAdmin = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const showNotification = useNotification();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const loggedInUser = getUserFromLocalStorage();
                const response = await axios.get(API_ENDPOINTS.USERS + `/${loggedInUser}`);
                const user = response.data;
                const userIsAdmin = user && user.isAdmin;
                setIsAdmin(userIsAdmin);
            } catch (e) {
                showNotification('Error fetching user:', e);

            }
        };

        fetchData();
    }, [showNotification]);

    return isAdmin ? <>{children}</> : null;
};

export default AllowOnlyAdmin;
