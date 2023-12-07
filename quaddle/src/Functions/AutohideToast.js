import React, { useState, useEffect } from 'react';
import Toast from 'react-bootstrap/Toast';

export function AutohideToast(errorMessage) {

    const [show, setShow] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(true);
        }, 200); // 200 milliseconds delay
        return () => clearTimeout(timer);
    }, []);

    return (
        <Toast className="position-absolute bottom-0 end-0 m-3" style={{ zIndex: 50 }} onClose={() => setShow(false)} show={show} delay={3000} autohide>
            <Toast.Header>
                <strong className="me-auto">Error</strong>
            </Toast.Header>
            <Toast.Body>{errorMessage}</Toast.Body>
        </Toast>
    );
}

