import React from 'react';
import { useAuth } from '../AuthContext/authContext';

const LogoutButton = () => {
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        // Dodatkowe czynności po wylogowaniu, jeśli są potrzebne
    };

    return (
        <li><button className="dropdown-item" onClick={handleLogout}>
            Logout
        </button></li>


    );
};

export default LogoutButton;
