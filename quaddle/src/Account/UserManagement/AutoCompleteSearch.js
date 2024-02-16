// AutoCompleteSearch.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HomeColFirst from '../../HomePage/HomeColFirst';
import { useNotification } from '../../Functions/NotificationContext';
import UserList from './UserList';
import EditUserForm from './EditUserForm';
import API_ENDPOINTS from '../../ApiEndpoints/apiConfig';
import getOptions from '../../Config/getOptions';

const AutoCompleteSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSolver, setisSolver] = useState(false);
    const [is_active, setis_active] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const showNotification = useNotification();
    const [unitsOptions, setUnitsOptions] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {

                const unitList = await getOptions('Units');
                setUnitsOptions(unitList);
                const response = await axios.get(API_ENDPOINTS.USERS_LIST);
                setUsers(response.data);
                setSuggestions(response.data);

            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);
    const handleSearch = (value) => {
        setSearchTerm(value);

        if (value.trim() === '') {
            const filteredUsers = users.filter(
                (user) =>
                    (user.first_name.toLowerCase() + ' ' + user.last_name.toLowerCase()) ||
                    (user.last_name.toLowerCase() + ' ' + user.first_name.toLowerCase()) ||
                    user.username.toLowerCase()
            );
            setSuggestions(filteredUsers);
        } else {
            const filteredUsers = users.filter(
                (user) =>
                    (user.first_name.toLowerCase() + ' ' + user.last_name.toLowerCase()).includes(value.toLowerCase()) ||
                    (user.last_name.toLowerCase() + ' ' + user.first_name.toLowerCase()).includes(value.toLowerCase()) ||
                    user.username.toLowerCase().includes(value.toLowerCase())
            );

            setSuggestions(filteredUsers);
        }
    };


    const handleUpdate = (userId) => {
        const userToEdit = users.find((user) => user.id === userId);
        setEditingUser(userToEdit);
        setIsAdmin(userToEdit.is_admin || false);
        setisSolver(userToEdit.is_solver || false);
        setis_active(userToEdit.is_active);
        setShowEditForm(true);
    };

    const handleDelete = async (userId) => {
        try {
            await axios.delete(API_ENDPOINTS.USERS_LIST + `${userId}`);
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
            setShowEditForm(false);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleEditFormChange = (e) => {
        if (e.target.name === 'is_admin') {
            setIsAdmin(e.target.checked);
        } else if (e.target.name === 'is_solver') {
            setisSolver(e.target.checked);
        } else if (e.target.name === 'is_active') {
            setis_active(e.target.checked); // Ustaw stan na wartość zaznaczenia checkboxa
        } else if (e.target.name === 'newPassword') {
            setNewPassword(e.target.value);
        } else if (e.target.name === 'confirmPassword') {
            setConfirmPassword(e.target.value);
        }

        setEditingUser({
            ...editingUser,
            [e.target.name]: e.target.value,
        });
    };

    const handleEditFormSubmit = async (e) => {
        e.preventDefault();

        try {
            const updatedUser = {
                ...editingUser,
                is_admin: isAdmin,
                is_solver: isSolver,
                is_active: is_active,
            };

            if (newPassword && newPassword == confirmPassword) {
                if (editingUser.password && (editingUser.password === newPassword)) {
                    // Jeśli użytkownik ma już ustawione hasło, użyj nowego hasła
                    updatedUser.password = newPassword;
                } else if (!editingUser.password) {
                    updatedUser.password = newPassword;
                } else {
                    showNotification("Current password is incorrect.");
                    return;
                }
            } else if (newPassword || confirmPassword) {
                showNotification("New password and confirm password must match.");
                return;
            }

            const existingUser = users.find(user => user.username === updatedUser.username && user.id !== updatedUser.id);
            if (existingUser) {
                showNotification('Username already exists. Choose a different username.');
            } else {
                const { newPassword, confirmPassword, ...userDataWithoutPasswords } = updatedUser;

                await axios.put(API_ENDPOINTS.UPDATE_USER + `${editingUser.id}`, userDataWithoutPasswords);
                setUsers((prevUsers) =>
                    prevUsers.map((user) => (user.id === editingUser.id ? userDataWithoutPasswords : user))
                );
                setShowEditForm(false);
                showNotification('Successfully saved user data');
            }
        } catch (error) {
            showNotification('Error updating user:', error);
        }
    };

    return (
        <div className="row g-0">
            <HomeColFirst />

            <UserList
                searchTerm={searchTerm}
                handleSearch={handleSearch}
                suggestions={suggestions}
                handleUpdate={handleUpdate}
                handleDelete={handleDelete}
            />
            <EditUserForm
                showEditForm={showEditForm}
                editingUser={editingUser}
                unitsOptions={unitsOptions}
                isAdmin={isAdmin}
                isSolver={isSolver}
                is_active={is_active}
                newPassword={newPassword}
                confirmPassword={confirmPassword}
                handleEditFormChange={handleEditFormChange}
                handleEditFormSubmit={handleEditFormSubmit}
            />
        </div>
    );
};

export default AutoCompleteSearch;
