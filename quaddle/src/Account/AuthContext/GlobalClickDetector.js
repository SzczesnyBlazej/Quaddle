import React, { useEffect } from 'react';

const GlobalClickDetector = ({ onGlobalClick, children }) => {
    const handleGlobalClick = (event) => {
        if (onGlobalClick) {
            onGlobalClick(event);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleGlobalClick);

        return () => {
            document.removeEventListener('mousedown', handleGlobalClick);
        };
    }, [onGlobalClick]);

    return <>{children}</>;
};

export default GlobalClickDetector;
