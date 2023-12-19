// NotificationContext.js
import React, { createContext, useContext, useState } from 'react';
import Notification from './Notification';

const NotificationContext = createContext();

export const useNotification = () => {
    return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);

    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => {
            setNotification(null);
        }, 4000);
    };

    return (
        <NotificationContext.Provider value={showNotification}>
            {children}
            {notification && (
                <Notification message={notification} onClose={() => setNotification(null)} />
            )}
        </NotificationContext.Provider>
    );
};
