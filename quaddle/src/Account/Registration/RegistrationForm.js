import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useNotification } from '../../Functions/NotificationContext';
import API_ENDPOINTS from '../../ApiEndpoints/apiConfig';
import logo from '../../LOGO.png';
import { useAuth } from '../AuthContext/authContext';

const RegistrationForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [registrationError, setRegistrationError] = useState('');
    const navigate = useNavigate();
    const showNotification = useNotification();
    const { login } = useAuth();

    const handleRegistration = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(API_ENDPOINTS.REGISTRATION, {
                email,
                username,
                password,
                confirmPassword,
                first_name: name,
                last_name: surname,
            });

            if (response.data && response.data.error) {
                setRegistrationError(response.data.error);
            } else {
                await login(username, password);

                navigate('/');
            }
        } catch (error) {

            if (error.response && error.response.data && error.response.data.error) {
                const errorObject = error.response.data.error;
                let errorMessage = '';

                for (const key in errorObject) {
                    if (Array.isArray(errorObject[key])) {
                        errorMessage += `${key}: ${errorObject[key].join(", \n")}\n`;
                    }
                }

                showNotification('Error during registration:', errorMessage);
                setRegistrationError('Error during registration: ' + errorMessage);
            } else {
                showNotification('Error during registration:', error.message);
                setRegistrationError('Error during registration: ' + error.message);
            }
        }
    };




    return (
        <div className="dark-bg text-light min-vh-100 d-flex align-items-center">
            <div className="container">
                <div className='row justify-content-center'>
                    <div className='d-flex flex-column align-items-center justify-content-center text-center'>
                        <h2 className='text-light position-relative'>Quaddle</h2>
                    </div>
                    <div className='d-flex flex-column align-items-center justify-content-center text-center'>
                        <img
                            src={logo}
                            alt="Quaddle Logo"
                            className="img-fluid position-relative max-logo-size"
                        />
                    </div>
                </div>
                <div className="row justify-content-center mt-5">
                    <div className="col-md-4">
                        <div className="card bg-white">
                            <div className="card-body">
                                <h2 className="text-center mb-4">Register</h2>
                                {registrationError && (
                                    <div className="alert alert-danger" role="alert">
                                        {registrationError}
                                    </div>
                                )}
                                <form onSubmit={handleRegistration}>
                                    <div className="form-group">
                                        <label htmlFor="username">Email:</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
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
                                        <label htmlFor="name">First name:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            placeholder="Enter your first name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="surname">Last name:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="surname"
                                            placeholder="Enter your last name"
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
