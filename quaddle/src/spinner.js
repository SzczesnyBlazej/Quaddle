import React from 'react';
import SpinnerSVG from './SpinnerSVG.svg'; // Dodaj ścieżkę do swojego pliku SVG
const LoadingSpinner = () => {
    return (
        <div className="loading-spinner-overlay d-flex align-items-center justify-content-center">
            <div className="loading-spinner-container text-center">
                <img src={SpinnerSVG} alt="Loading spinner" className="loading-spinner" />
                <h3 className="loading-spinner-content text-dark">
                    Loading...
                </h3>
            </div>
        </div>
    );
};

export default LoadingSpinner;
