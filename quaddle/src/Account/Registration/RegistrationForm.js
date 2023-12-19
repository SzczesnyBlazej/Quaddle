import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useNotification } from '../../Functions/NotificationContext';
import API_ENDPOINTS from '../../ApiEndpoints/apiConfig';

const RegistrationForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [isAdmin] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [registrationError, setRegistrationError] = useState('');
    const navigate = useNavigate();
    const showNotification = useNotification();

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    const handleRegistration = async (e) => {
        e.preventDefault();

        try {
            if (password !== confirmPassword) {
                setRegistrationError('Passwords do not match');
                showNotification('Passwords do not match');
                return;
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const nameInitial = name.charAt(0).toUpperCase();
            const surnameInitial = surname.charAt(0).toUpperCase();
            const calculatedInitials = `${nameInitial}${surnameInitial}`;

            const getUsers = await axios.get(API_ENDPOINTS.USERS);
            const users = getUsers.data;
            const foundUser = users.find(user => user.username === username);

            if (foundUser) {
                showNotification('The specified username already exists');
                setRegistrationError('The specified username already exists');
                return;
            }
            await axios.post(API_ENDPOINTS.USERS, {
                username,
                password: hashedPassword,
                name,
                surname,
                isAdmin,
                initials: calculatedInitials,
                logoColor: getRandomColor(),
            });


            setRegistrationError('');
            navigate('/');
        } catch (error) {
            showNotification('Error during registration:', error.message);
            setRegistrationError('Error during registration');
        }
    };
    return (
        <div className="dark-bg text-light min-vh-100 d-flex align-items-center">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <h2 className="text-center mb-4">Register</h2>
                                {registrationError && (
                                    <div className="alert alert-danger" role="alert">
                                        {registrationError}
                                    </div>
                                )}
                                <form onSubmit={handleRegistration}>
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
                                        <label htmlFor="name">Name:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            placeholder="Enter your name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="surname">Surname:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="surname"
                                            placeholder="Enter your surname"
                                            value={surname}
                                            onChange={(e) => setSurname(e.target.value)}
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
                                    <div className="form-group">
                                        <label htmlFor="confirmPassword">Confirm Password:</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="confirmPassword"
                                            placeholder="Confirm your password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                    <div className="container">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <button type="submit" className="btn btn-primary btn-block m-2">Register</button>


                                            </div>
                                            <div className="col-md-6 d-flex align-items-center">
                                                <div className="ms-auto">
                                                    <Link to="/login">Log in</Link>
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

export default RegistrationForm;
