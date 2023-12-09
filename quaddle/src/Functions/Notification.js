// Notification.js
import React from 'react';
import Toast from 'react-bootstrap/Toast';

const Notification = ({ message, onClose }) => {
    return (
        <Toast
            onClose={onClose}
            style={{
                position: 'fixed',
                bottom: '10px',
                right: '10px',
                minWidth: '200px',
            }}
        >
            <Toast.Body>{message}</Toast.Body>
        </Toast>
    );
};

export default Notification;
