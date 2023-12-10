import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from './authContext';
import { useNotification } from '../Functions/NotificationContext';
import bcrypt from 'bcryptjs';  // Import bcryptjs

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();
    const [users, setUsers] = useState([]);
    const showNotification = useNotification();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3500/users');
                setUsers(response.data);
            } catch (error) {
                showNotification('Error fetching users:', error.message);
            }
        };

        fetchUsers();
    }, [showNotification]);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const foundUser = users.find((user) => user.username === username);

            if (foundUser) {
                // Porównaj zaszyfrowane hasło
                const isPasswordMatch = await bcrypt.compare(password, foundUser.password);

                if (isPasswordMatch) {
                    setLoginError('');
                    login(foundUser);
                    navigate('/');
                } else {
                    showNotification('Błędne dane logowania');
                    setLoginError('Błędne dane logowania');
                }
            } else {
                showNotification('Błędne dane logowania');
                setLoginError('Błędne dane logowania');
            }
        } catch (error) {
            showNotification('Error during login:', error.message);
        }
    };

    return (
        <div className="dark-bg text-light min-vh-100 d-flex align-items-center">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <h2 className="text-center mb-4">Login</h2>
                                {loginError && (
                                    <div className="alert alert-danger" role="alert">
                                        {loginError}
                                    </div>
                                )}
                                <form onSubmit={handleLogin}>
                                    <div className="form-group">
                                        <label htmlFor="username">Username:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="username"
                                            placeholder="Enter your username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password">Password:</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                    <div className="container">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <button type="submit" className="btn btn-primary btn-block m-2">Login</button>
                                            </div>
                                            <div className="col-md-6 d-flex align-items-center">
                                                <div className="ms-auto">
                                                    <Link to="/registration">Sign up</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
