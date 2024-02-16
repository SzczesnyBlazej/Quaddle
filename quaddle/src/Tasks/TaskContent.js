import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faLock, faLockOpen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { getCurrentDateFormatted, getCurrentTimeFormatted, sendNotification } from './Functions'
import { useAuth } from '../Account/AuthContext/authContext';
import { useNotification } from '../Functions/NotificationContext';
import ClickableLogo from '../Overviews/Templates/ClicableLogo';
import API_ENDPOINTS from '../ApiEndpoints/apiConfig';
import { Modal } from 'react-bootstrap';
import DragAndDropFileUpload from './DragAndDropFileUpload';

const TaskContent = ({ task }) => {
    const showNotification = useNotification();
    const { authState } = useAuth();
    const user = authState.user;
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSolver, setIsSolver] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState(null);
    const [prevFiles, setFiles] = useState([]);

    const handleAddedFiles = (e) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        setFiles(prevFiles => prevFiles.concat(droppedFiles));
    };

    const saveFilesLocally = () => {
        prevFiles.forEach((file) => {
            const url = URL.createObjectURL(file);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    };

    const confirmDelete = async () => {
        try {
            if (messageToDelete) {
                await handleDeleteMessage(messageToDelete.id);
                setShowConfirmModal(false);
                setMessageToDelete(null);
            }
        } catch (error) {
            showNotification('Error confirming deletion: ' + error.message);
        }
    };

    const openDeleteModal = (message) => {
        setMessageToDelete(message);
        setShowConfirmModal(true);
    };

    const updateLockStatus = async (messageId, is_lock) => {
        try {
            await axios.patch(`${API_ENDPOINTS.UPDATE_MESSAGE}/${messageId}`, {
                is_lock: !is_lock,
            });
            showNotification('Lock has been modified');
            fetchMessages();
        } catch (error) {
            showNotification('Error updating lock status: ' + error.message);
        }
    };


    const handleDeleteMessage = async (messageId) => {
        try {
            await axios.delete(`${API_ENDPOINTS.DELETE_MESSAGES_TASK}${messageId}`);
            showNotification('Message has been deleted');

            fetchMessages();
        } catch (error) {
            showNotification('Error deleting message: ' + error.message);
        }
    };

    const updateMessage = async (e) => {
        e.preventDefault();
        try {
            console.log(prevFiles)
            await axios.post(API_ENDPOINTS.CREATE_MESSAGE, {
                message: message,
                clientID: task?.client_fk?.id,
                taskID: task?.id,
                messageSender: user.id,
                createDate: getCurrentDateFormatted(),
                createHour: getCurrentTimeFormatted(),
                isLock: false,
            });
            showNotification('Comment has been added');
            sendNotification("added a comment for", task?.id, user.id);
            saveFilesLocally();
            setMessage('');
            fetchMessages();
        } catch (error) {
            showNotification('Error updating task: ' + error.message);
        }
    };

    const fetchMessages = async () => {
        try {
            if (task) {
                const response = await axios.get(API_ENDPOINTS.MESSAGES_TASK, {
                    params: {
                        task_id: task.id,
                    },
                });
                setMessages(response.data);
            }
        } catch (error) {
            showNotification('Error fetching messages: ' + error.message);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [task]);

    useEffect(() => {

        setIsAdmin(user?.is_admin);
        setIsSolver(user?.is_solver);
    }, [user]);


    return (
        <div className="col-md-8 dark-bg min-vh-100 border-start border-end border-secondary d-flex flex-column position-relative" style={{ maxHeight: 'calc(100vh - 180px)' }}>
            <div className="d-flex flex-column overflow-auto" style={{ maxHeight: '79vh' }}>
                <div className='container custom-width'>
                    <div className='d-flex flex-column justify-content-center align-items-center pt-5 text-secondary'>
                        {task && (
                            <ClickableLogo user={task.client_fk} />
                        )}
                        <h2 className='ps-3 pe-3 mt-4 mb-3 ms-5 me-5 light-bg rounded'>{task?.title}</h2>
                        <p className='text-secondary'>Ticket #{task?.id} {task?.create_date} at {task?.create_hour}</p>
                    </div>
                    <div className='row flex-row'>
                        <div className='col-md-1'></div>
                        <div className='col-md-10 d-flex flex row justify-content-between'>
                            <span
                                className={`pt-3 pb-3 mt-3 mb-3 ps-3 pe-3 text-light light-bg rounded w-100 ${user?.id === task?.client_fk.id ? 'green-border' : ''}`}
                            >
                                {task?.description}
                            </span>
                            <p className="card-text text-secondary text-center"><small >{task?.create_date} at {task?.create_hour}</small></p>
                        </div>
                        <div className='col-md-1'>{task && (
                            <ClickableLogo user={task.client_fk} />
                        )}</div>
                    </div>
                    {messages.map((message) => (
                        <div key={message?.id} className='row flex-row'>
                            {message.message_sender_fk?.id !== user?.id ? (
                                message.is_lock ? (
                                    isAdmin || isSolver ? (
                                        <div className='col-md-1 mt-3'><ClickableLogo user={message.message_sender_fk} /></div>

                                    ) : (
                                        <div className='col-md-1 mt-3'></div>)

                                ) : (
                                    <div className='col-md-1 mt-3'><ClickableLogo user={message.message_sender_fk} /></div>

                                )
                            ) : (
                                <div className='col-md-1 d-flex flex-column align-items-end pt-3'>
                                    {isAdmin || isSolver ? (
                                        <>
                                            <button className='btn btn-link p-2' onClick={() => updateLockStatus(message.id, message.is_lock)}>
                                                <FontAwesomeIcon icon={message.is_lock ? faLockOpen : faLock} style={{ color: "#dedede" }} />
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

                                {message.is_lock ? (
                                    isAdmin || isSolver ? (
                                        <>
                                            <span
                                                className={`pt-3 pb-3 mt-3 mb-3 ps-3 pe-3 text-light light-bg rounded w-100 ${message.message_sender_fk?.id === user?.id ? 'green-border' : ''}`}
                                                style={{ border: '2px solid #ff6347' }}
                                            >
                                                {message.message}
                                            </span>
                                            <p className="card-text text-secondary text-center"><small >{message?.create_date} at {message?.create_hour}</small></p>
                                        </>
                                    ) : (
                                        null
                                    )
                                ) : (
                                    <>
                                        <span
                                            className={`pt-3 pb-3 mt-3 mb-3 ps-3 pe-3 text-light light-bg rounded w-100 ${message.message_sender_fk?.id === user?.id ? 'green-border' : ''}`}
                                        >
                                            {message.message}
                                        </span>
                                        <p className="card-text text-secondary text-center"><small >{message?.create_date} at {message?.create_hour}</small></p>
                                    </>
                                )}
                            </div>
                            {message.message_sender_fk?.id === user?.id ? (
                                <div className='col-md-1 mt-3'><ClickableLogo user={message.message_sender_fk} /></div>
                            ) : (
                                <div className='col-md-1'></div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="text-light mt-auto position-absolute bottom-0 w-100">
                    <hr className="border-secondary" />

                    <div className='w-100'>

                        <DragAndDropFileUpload handleAddedFiles={handleAddedFiles} />
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
                        <div
                            className="btn btn-outline-dark"
                            onClick={() => setShowConfirmModal(false)}
                        >
                            Cancel
                        </div >
                        <div className='btn btn-outline-dark' onClick={confirmDelete}>
                            Delete
                        </div>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default TaskContent;
