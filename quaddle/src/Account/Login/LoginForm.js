import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useNotification } from '../../Functions/NotificationContext';
import logo from '../../LOGO.png';
import { useAuth } from '../AuthContext/authContext';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate();
    const showNotification = useNotification();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            await login(username, password);
            navigate('/');
        } catch (error) {
            console.error('Login Error:', error);

            setLoginError('Invalid login credentials');
            showNotification('Invalid login credentials');
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
                        <img src={logo} alt="Quaddle Logo" className="img-fluid position-relative max-logo-size" />
                    </div>
                </div>
                <div className="row justify-content-center mt-5">
                    <div className="col-md-4">
                        <div className="card bg-white">
                            <div className="card-body">
                                <h2 className="text-center mb-4">Login</h2>
                                {loginError && <div className="alert alert-danger" role="alert">{loginError}</div>}
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
                <div className='row'></div>
            </div>
        </div>
    );
};

export default LoginForm;
