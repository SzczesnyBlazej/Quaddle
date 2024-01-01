import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faLock, faLockOpen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { getCurrentDateFormatted, getCurrentTimeFormatted, sendNotification } from './Functions'
import { useAuth } from '../Account/AuthContext/authContext';
import { useNotification } from '../Functions/NotificationContext';
import ClickableLogo from '../Overviews/Templates/ClicableLogo';
import API_ENDPOINTS from '../ApiEndpoints/apiConfig';
import ifUserIsAdminBoolean from '../Account/AuthContext/ifUserIsAdminBoolean';
import ifUserIsSolverBoolean from '../Account/AuthContext/ifUserIsSolverBoolean';
import { Modal, Button } from 'react-bootstrap';

const TaskContent = ({ task }) => {
    const showNotification = useNotification();

    const [clientDetail, setClientDetail] = useState([]);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const { user } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSolver, setIsSolver] = useState(false);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState(null);

    const confirmDelete = async () => {
        if (messageToDelete) {
            await handleDeleteMessage(messageToDelete.id);
            setShowConfirmModal(false);
            setMessageToDelete(null); // Reset the messageToDelete state
        }
    };

    const openDeleteModal = (message) => {
        setMessageToDelete(message);
        setShowConfirmModal(true);
    };

    const updateLockStatus = async (messageId, isLock) => {
        try {
            await axios.patch(API_ENDPOINTS.MESSAGES + `/${messageId}`, {
                isLock: !isLock,
            });

            fetchMessages();
        } catch (error) {
            showNotification('Error updating lock status:', error.message);
        }
    };

    const handleDeleteMessage = async (messageId) => {
        try {
            await axios.delete(API_ENDPOINTS.MESSAGES + `/${messageId}`);

            fetchMessages();
        } catch (error) {
            showNotification('Error during delete message:' + error.message);
        }
    };

    const fetchMessages = useCallback(async () => {
        try {
            if (task) {
                const response = await axios.get(API_ENDPOINTS.MESSAGES + `?taskID=${task?.id}`);
                setMessages(response.data);
            }
        } catch (error) {
            showNotification('Error fetching messages:', error.message);
        }
    }, [task, showNotification]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                setIsAdmin(await ifUserIsAdminBoolean(user.id))
                setIsSolver(await ifUserIsSolverBoolean(user.id))
                if (task && task.clientID) {
                    const userResponse = await axios.get(API_ENDPOINTS.USERS + `/${task?.clientID}`);
                    setClientDetail(userResponse.data);
                }
            } catch (error) {
                showNotification('Error fetching user details:', error.message);
            }
        };

        fetchUserDetails();
        fetchMessages();
    }, [task?.clientID, showNotification, fetchMessages, task]);

    const updateMessage = async (e) => {
        e.preventDefault();

        try {
            await axios.post(API_ENDPOINTS.MESSAGES, {
                message: message,
                clientID: clientDetail?.id,
                taskID: task?.id,
                messageSender: user,
                createDate: getCurrentDateFormatted(),
                createHour: getCurrentTimeFormatted(),
                isLock: false,
            });

            sendNotification("added a comment for", task?.id);

            setMessage('');
            fetchMessages();

        } catch (error) {
            showNotification('Błąd podczas aktualizacji zadania:', error.message);
        }
    };

    return (
        <div className="col-md-8 dark-bg min-vh-100 border-start border-end border-secondary d-flex flex-column position-relative" style={{ maxHeight: 'calc(100vh - 180px)' }}>
            <div className="d-flex flex-column overflow-auto" style={{ maxHeight: '85vh' }}>
                <div className='container custom-width'>
                    <div className='d-flex flex-column justify-content-center align-items-center pt-5 text-secondary'>
                        <ClickableLogo user={clientDetail} />
                        <h2 className='ps-3 pe-3 mt-4 mb-3 ms-5 me-5 light-bg rounded'>{task?.title}</h2>
                        <p className='text-secondary'>Ticket #{task?.id} {task?.createDate} at {task?.createHour}</p>
                    </div>
                    <div className='row flex-row'>
                        <div className='col-md-1'></div>
                        <div className='col-md-10 d-flex flex row justify-content-between'>
                            <span
                                className={`pt-3 pb-3 mt-3 mb-3 ps-3 pe-3 text-light light-bg rounded w-100 ${user?.id === task?.clientID ? 'green-border' : ''}`}
                            >
                                {task?.description}
                            </span>
                            <p className="card-text text-secondary text-center"><small >{task?.createDate} at {task?.createHour}</small></p>
                        </div>
                        <div className='col-md-1'><ClickableLogo user={clientDetail} /></div>
                    </div>
                    {messages.map((message) => (
                        <div key={message?.id} className='row flex-row'>
                            {message.messageSender?.id !== user?.id ? (
                                message.isLock ? (
                                    isAdmin || isSolver ? (
                                        <div className='col-md-1 mt-3'><ClickableLogo user={message.messageSender} /></div>

                                    ) : (
                                        <div className='col-md-1 mt-3'></div>)

                                ) : (
                                    <div className='col-md-1 mt-3'><ClickableLogo user={message.messageSender} /></div>

                                )
                            ) : (
                                <div className='col-md-1 d-flex flex-column align-items-end pt-3'>
                                    {isAdmin || isSolver ? (
                                        <>
                                            <button className='btn btn-link p-2' onClick={() => updateLockStatus(message.id, message.isLock)}>
                                                <FontAwesomeIcon icon={message.isLock ? faLockOpen : faLock} style={{ color: "#dedede" }} />
                                            </button>
                                            <button className='btn btn-link p-2' onClick={() => openDeleteModal(message)}>
                                                <FontAwesomeIcon icon={faTrash} style={{ color: "#dedede" }} />
                                            </button>
                                        </>
                                    ) : (
                                        <div className='row p-2'></div>
                                    )}
                                    <div className='row p-2'></div>
                                </div>
                            )}
                            <div className='col-md-10 d-flex flex row justify-content-between'>

                                {message.isLock ? (
                                    isAdmin || isSolver ? (
                                        <>
                                            <span
                                                className={`pt-3 pb-3 mt-3 mb-3 ps-3 pe-3 text-light light-bg rounded w-100 ${message.messageSender?.id === user?.id ? 'green-border' : ''}`}
                                                style={{ border: '2px solid #ff6347' }}
                                            >
                                                {message.message}
                                            </span>
                                            <p className="card-text text-secondary text-center"><small >{message?.createDate} at {message?.createHour}</small></p>
                                        </>
                                    ) : (
                                        null
                                    )
                                ) : (
                                    <>
                                        <span
                                            className={`pt-3 pb-3 mt-3 mb-3 ps-3 pe-3 text-light light-bg rounded w-100 ${message.messageSender?.id === user?.id ? 'green-border' : ''}`}
                                        >
                                            {message.message}
                                        </span>
                                        <p className="card-text text-secondary text-center"><small >{message?.createDate} at {message?.createHour}</small></p>
                                    </>
                                )}
                            </div>
                            {message.messageSender?.id === user?.id ? (
                                <div className='col-md-1 mt-3'><ClickableLogo user={message.messageSender} /></div>
                            ) : (
                                <div className='col-md-1'></div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="text-light mt-auto position-absolute bottom-0 w-100">
                    <hr className="border-secondary" />
                    <div className='w-100'>
                        <div className='col ms-3 me-3 mb-3'>
                            <div className="input-group">
                                <textarea
                                    className="form-control"
                                    id="exampleTextarea"
                                    rows="3"
                                    placeholder="Enter your message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                ></textarea>
                                <button className="btn btn-outline-light send-icon" type="button" onClick={updateMessage}>
                                    <FontAwesomeIcon icon={faPaperPlane} style={{ color: 'antiquewhite' }} size="2xl" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal
                    show={showConfirmModal}
                    onHide={() => setShowConfirmModal(false)}
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Deletion</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete this message?
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
        </div>
    );
};

export default TaskContent;
