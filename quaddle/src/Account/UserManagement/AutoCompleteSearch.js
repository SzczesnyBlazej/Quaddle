// AutoCompleteSearch.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import HomeColFirst from '../../HomePage/HomeColFirst';
import { useNotification } from '../../Functions/NotificationContext';
import UserList from './UserList';
import EditUserForm from './EditUserForm';
import API_ENDPOINTS from '../../ApiEndpoints/apiConfig';

const AutoCompleteSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const showNotification = useNotification();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(API_ENDPOINTS.USERS);
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleSearch = (value) => {
        setSearchTerm(value);

        if (value.trim() === '') {
            setSuggestions([]);
        } else {
            const filteredUsers = users.filter(
                (user) =>
                    (user.name.toLowerCase() + ' ' + user.surname.toLowerCase()).includes(value.toLowerCase()) ||
                    (user.surname.toLowerCase() + ' ' + user.name.toLowerCase()).includes(value.toLowerCase()) ||
                    user.username.toLowerCase().includes(value.toLowerCase())
            );

            setSuggestions(filteredUsers);
        }
    };

    const handleUpdate = (userId) => {
        const userToEdit = users.find((user) => user.id === userId);
        setEditingUser(userToEdit);
        setIsAdmin(userToEdit.isAdmin || false);
        setShowEditForm(true);
    };

    const handleDelete = async (userId) => {
        try {
            await axios.delete(API_ENDPOINTS.USERS + `/${userId}`);
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
            setShowEditForm(false);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleEditFormChange = (e) => {
        setEditingUser({
            ...editingUser,
            [e.target.name]: e.target.value,
        });

        if (e.target.name === 'isAdmin') {
            setIsAdmin(e.target.checked);
        } else if (e.target.name === 'newPassword') {
            setNewPassword(e.target.value);
        } else if (e.target.name === 'confirmPassword') {
            setConfirmPassword(e.target.value);
        }
    };

    const handleEditFormSubmit = async (e) => {
        e.preventDefault();

        try {
            const updatedUser = {
                ...editingUser,
                isAdmin: isAdmin,
            };

            if (newPassword && newPassword === confirmPassword) {
                if (editingUser.password && !bcrypt.compareSync(editingUser.password, newPassword)) {
                    const hashedPassword = await bcrypt.hash(newPassword, 10);
                    updatedUser.password = hashedPassword;
                } else if (!editingUser.password) {
                    const hashedPassword = await bcrypt.hash(newPassword, 10);
                    updatedUser.password = hashedPassword;
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

                await axios.put(API_ENDPOINTS.USERS + `/${editingUser.id}`, userDataWithoutPasswords);
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
                isAdmin={isAdmin}
                newPassword={newPassword}
                confirmPassword={confirmPassword}
                handleEditFormChange={handleEditFormChange}
                handleEditFormSubmit={handleEditFormSubmit}
            />
        </div>
    );
};

export default AutoCompleteSearch;
