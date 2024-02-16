import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const ConfigRenderer = ({ title, options, handleUpdateOption }) => {
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    return (
        <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center">
                <h4>{title}</h4>
                <div className="d-flex">
                    <div className="input-group mb-2">

                    </div>
                    <button
                        className="btn btn-outline-light ms-2 mb-2"
                        onClick={toggleVisibility}
                    >
                        {isVisible ? (
                            <FontAwesomeIcon icon={faEyeSlash} />
                        ) : (
                            <FontAwesomeIcon icon={faEye} />
                        )}
                    </button>
                </div>
            </div>
            {isVisible && (

                <ul className="list-group">

                    {options ? (
                        <li
                            key={options.id}
                            className="list-group-item border-0 dark-bg text-light mb-2"
                        >
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>ID:</strong> {options.id},&nbsp;
                                    <strong>Value:</strong> {options.value},&nbsp;
                                    <strong>Active:</strong>{' '}
                                    <input
                                        type="checkbox"
                                        className="form-check-input bg-transparent border border-white"
                                        checked={options.enable}
                                        readOnly
                                    />
                                </div>
                                <div className="d-flex">
                                    <button
                                        className="btn btn-outline-light ms-2"
                                        onClick={() => handleUpdateOption(options.id, options.title.toLowerCase(), options)}
                                    >
                                        Update
                                    </button>

                                </div>
                            </div>
                            <p>{options.description}</p>

                        </li>
                    ) : (
                        <p>No {options.title.toLowerCase()} options available.</p>
                    )}
                </ul>
            )}

            <hr className="border-secondary" />


        </div>
    );
};

export default ConfigRenderer;
