// SessionTimer.js
import React, { useState, useEffect } from 'react';
import { useAuth } from './authContext';

const SessionTimer = () => {
    const { isAuthenticated, logout } = useAuth();
    const [remainingTime, setRemainingTime] = useState(null);

    const SESSION_TIMEOUT = 10 * 60 * 1000;

    useEffect(() => {
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
    }, [isAuthenticated, logout]);

    const formatTime = (milliseconds) => {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    return (
        <div>
            {remainingTime !== null ? (
                <p className='fw-lighter fst-italic'>Time remaining session: {formatTime(remainingTime)}</p>
            ) : (
                <p className='text-light'>Session has timed out</p>
            )}
        </div>
    );
};

export default SessionTimer;
