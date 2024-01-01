import React, { useEffect } from 'react';

const GlobalClickDetector = ({ onGlobalClick, children }) => {
    const handleGlobalClick = (event) => {
        // Wywołaj przekazaną funkcję, gdy nastąpi globalne kliknięcie
        if (onGlobalClick) {
            onGlobalClick(event);
        }
    };

    useEffect(() => {
        // Dodaj event listener dla mousedown do dokumentu
        document.addEventListener('mousedown', handleGlobalClick);

        // Oczyść event listener przy odmontowywaniu komponentu
        return () => {
            document.removeEventListener('mousedown', handleGlobalClick);
        };
    }, [onGlobalClick]);

    return <>{children}</>; // Zwróć dzieci komponentu
};

export default GlobalClickDetector;
