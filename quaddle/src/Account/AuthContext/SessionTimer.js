import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useAuth } from './authContext';

const SessionTimer = () => {
    const { isAuthenticated, logout } = useAuth();
    const [remainingTime, setRemainingTime] = useState(null);
    const [sessionConfig, setSessionConfig] = useState([{ id: 1, enable: true, session_timeout: 10 }]);

    useEffect(() => {
        const fetchSessionConfig = async () => {
            try {
                const response = await axios.get('http://localhost:3507/enableSessionTimeout');
                setSessionConfig(response.data);
            } catch (error) {
                console.error('Error fetching session config:', error);
            }
        };

        fetchSessionConfig();
    }, []);

    useEffect(() => {

        if (sessionConfig.length > 0 && sessionConfig[0].enable) {
            const enable = sessionConfig[0]?.enable;
            const sessionTimeout = sessionConfig[0]?.session_timeout;


            if (enable) {
                const SESSION_TIMEOUT = sessionTimeout * 60 * 1000;

                let intervalId;

                const calculateRemainingTime = () => {
                    const lastActivityTime = localStorage.getItem('lastActivityTime');

                    if (isAuthenticated() && lastActivityTime) {
                        const currentTime = new Date().getTime();
                        const elapsedTime = currentTime - parseInt(lastActivityTime, 10);
                        const remainingTime = Math.max(0, SESSION_TIMEOUT - elapsedTime);

                        setRemainingTime(remainingTime);

                        if (remainingTime === 0) {
                            logout();
                        }
                    }
                };

                calculateRemainingTime();

                intervalId = setInterval(calculateRemainingTime, 1000);

                return () => clearInterval(intervalId);
            }
        }
    }, [isAuthenticated, logout, sessionConfig]);

    const formatTime = (milliseconds) => {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    return (
        sessionConfig.length > 0 && sessionConfig[0].enable ? (
            <div>
                {remainingTime !== null ? (
                    <p className='fw-lighter fst-italic'>Time remaining session: {formatTime(remainingTime)}</p>
                ) : (
                    <p className='text-light'>Session has timed out</p>
                )}
            </div>
        ) : (
            <div></div>
        )
    );
};

export default SessionTimer;
