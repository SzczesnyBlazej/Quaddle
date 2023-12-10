import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HomeColFirst from '../HomePage/HomeColFirst';

const AutoCompleteSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3500/users');
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
                    user.name.toLowerCase().includes(value.toLowerCase()) ||
                    user.surname.toLowerCase().includes(value.toLowerCase()) ||
                    user.username.toLowerCase().includes(value.toLowerCase())
            );

            setSuggestions(filteredUsers);
        }
    };

    const handleUpdate = (userId) => {
        const userToEdit = users.find((user) => user.id === userId);
        setEditingUser(userToEdit);
        setIsAdmin(userToEdit.isAdmin || false); // Ustaw isAdmin na true, jeśli jest true, w przeciwnym razie na false

        setShowEditForm(true);
    };

    const handleDelete = async (userId) => {
        try {
            await axios.delete(`http://localhost:3500/users/${userId}`);

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
        }
    };

    const handleEditFormSubmit = async () => {
        try {
            const updatedUser = {
                ...editingUser,
                isAdmin: isAdmin,
            };

            await axios.put(`http://localhost:3500/users/${editingUser.id}`, updatedUser);

            setUsers((prevUsers) =>
                prevUsers.map((user) => (user.id === editingUser.id ? updatedUser : user))
            );

            setShowEditForm(false);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return (
        <div className="row g-0">
            <HomeColFirst />
            <div className="p-3 col-md-6 text-light dark-bg min-vh-100 border-start border-secondary">
                <h2>User Management</h2>
                <div className="mb-3 ">
                    <label htmlFor="searchInput" className="form-label">
                        Search:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="searchInput"
                        placeholder='Name, Surname, or Login'
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
                {suggestions.length > 0 && (
                    <ul className="list-group">
                        {suggestions.map((user) => (
                            <div className="row g-2" key={user.id}>
                                <div className="col-md-5">
                                    <li className="nav-link">
                                        {user.name} {user.surname} ({user.username})
                                    </li>
                                </div>
                                <div className="col-md-4">
                                    <button
                                        className="btn btn-warning"
                                        onClick={() => handleUpdate(user.id)}
                                    >
                                        Update
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDelete(user.id)}
                                    >
                                        Delete
                                    </button>
                                </div>

                            </div>
                        ))}
                    </ul>
                )}
            </div>
            <div className="p-3 col-md-4 text-light dark-bg min-vh-100 border-start border-secondary">
                {showEditForm && editingUser && (
                    <div className="col-md-6">
                        <h3>Edit User</h3>
                        <form onSubmit={handleEditFormSubmit}>
                            <div className="mb-3">
                                <label htmlFor="editName" className="form-label">
                                    Name:
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="editName"
                                    name="name"
                                    value={editingUser.name}
                                    onChange={handleEditFormChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="editSurname" className="form-label">
                                    Surname:
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="editSurname"
                                    name="surname"
                                    value={editingUser.surname}
                                    onChange={handleEditFormChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="editUsername" className="form-label">
                                    Username:
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="editUsername"
                                    name="username"
                                    value={editingUser.username}
                                    onChange={handleEditFormChange}
                                />
                            </div>
                            <div className='col-md-3'>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="editIsAdmin"
                                        name="isAdmin"
                                        checked={isAdmin}
                                        onChange={handleEditFormChange}
                                    />
                                    <label className="form-check-label" htmlFor="editIsAdmin">
                                        Admin
                                    </label>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Save Changes
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AutoCompleteSearch;
