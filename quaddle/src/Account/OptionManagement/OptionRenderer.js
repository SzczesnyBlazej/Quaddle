import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button } from 'react-bootstrap';

const OptionRenderer = ({ title, options, handleDelete }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [optionToDelete, setOptionToDelete] = useState(null);

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    const confirmDelete = () => {
        handleDelete(optionToDelete.id, optionToDelete.groupName);
        setShowConfirmModal(false);
    };

    const openDeleteModal = (optionId, groupName, optionName) => {
        setOptionToDelete({ id: optionId, groupName, optionName });
        setShowConfirmModal(true);
    };

    return (
        <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center">
                <h4>{title}</h4>
                <div className="d-flex">
                    <button className="btn btn-outline-light ms-2 mb-2">
                        Add
                    </button>
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
                    {options.length > 0 ? (
                        options.map((option) => (
                            <li
                                key={option.id}
                                className="list-group-item border-0 dark-bg text-light mb-2"
                            >
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>ID:</strong> {option.id},&nbsp;
                                        <strong>Name:</strong> {option.name},&nbsp;
                                        <strong>Value:</strong> {option.value},&nbsp;
                                        <strong>Active:</strong>{' '}
                                        <input
                                            type="checkbox"
                                            className="form-check-input bg-transparent border border-white"
                                            checked={option.active}
                                            readOnly
                                        />
                                    </div>
                                    <div className="d-flex">
                                        <button
                                            className="btn btn-outline-light ms-2"
                                        /* onClick={() => handleUpdate(option.id)} */
                                        >
                                            Update
                                        </button>
                                        <button
                                            className="btn btn-outline-light ms-2"
                                            onClick={() =>
                                                openDeleteModal(
                                                    option.id,
                                                    title.toLowerCase(),
                                                    option.name
                                                )
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p>No {title.toLowerCase()} options available.</p>
                    )}
                </ul>
            )}
            <hr className="border-secondary" />

            {/* Delete Confirmation Modal */}
            <Modal
                show={showConfirmModal}
                onHide={() => setShowConfirmModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete the option "{optionToDelete?.optionName}"?
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowConfirmModal(false)}
                    >
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default OptionRenderer;
