import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faLock, faLockOpen, faTrash, faWindowRestore } from '@fortawesome/free-solid-svg-icons';
import { getCurrentDateFormatted, getCurrentTimeFormatted, sendNotification } from './Functions'
import { useAuth } from '../Account/AuthContext/authContext';
import { useNotification } from '../Functions/NotificationContext';
import ClickableLogo from '../Overviews/Templates/ClicableLogo';
import API_ENDPOINTS from '../ApiEndpoints/apiConfig';
import { Modal } from 'react-bootstrap';
import DragAndDropFileUpload from './DragAndDropFileUpload';
import { AddHistoryEvent } from './addHistoryEvent';
import { Tooltip } from '@mui/material';
import PredefinedPhrasesModal from './PredefinedPhrases/PredefinedPhrasesModal';

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
    const [clearFilesFn, setClearFilesFn] = useState(null);
    const [height, setHeight] = useState();
    const [showPredefinedPhrasesModal, setShowPredefinedPhrasesModal] = useState(false);

    const handleFilesChange = (files) => {
        return files
    };

    useEffect(() => {
        const element = document.getElementById("DragAndDropFileUploadDiv");
        if (element) {
            const newHeight = element.offsetHeight;
            setHeight(newHeight);
        }
    }, [handleFilesChange]);


    const handleShowPredefinedPhrasesModal = () => {
        setShowPredefinedPhrasesModal(true);
    };

    const handleAddedFiles = async (e) => {
        e.preventDefault();
        if (e.dataTransfer && e.dataTransfer.files) {
            const droppedFiles = Array.from(e.dataTransfer.files);
            const filesWithBase64 = await Promise.all(droppedFiles.map(async (file) => {
                const base64 = await convertFileToBase64(file);
                return { file, base64 };
            }));
            setFiles((prevFiles) => [...prevFiles, ...filesWithBase64]);
        }
        if (e.target && e.target.files) {
            const selectedFiles = Array.from(e.target.files);

            const filesWithBase64 = await Promise.all(selectedFiles.map(async (file) => {
                const base64 = await convertFileToBase64(file);
                return { file, base64 };
            }));
            setFiles((prevFiles) => [...prevFiles, ...filesWithBase64]);
        }
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
                const result = await AddHistoryEvent(`Deleted message "${messageToDelete.message}" by id: ${messageToDelete.id} `, user.id, task.id);

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
            const result = await AddHistoryEvent(`Lock status for message ${messageId} has been modified to ${!is_lock}`, user.id, task.id);


            fetchMessages();
        } catch (error) {
            showNotification('Error updating lock status: ' + error.message);
        }
    };
    const handleInsertPhrase = (phrase) => {
        setMessage((prevMessage) => `${prevMessage} ${phrase}`);
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
            const formData = new FormData();
            formData.append('message', message);
            formData.append('clientID', task?.client_fk?.id);
            formData.append('taskID', task?.id);
            formData.append('messageSender', user.id);
            formData.append('createDate', getCurrentDateFormatted());
            formData.append('createHour', getCurrentTimeFormatted());
            formData.append('isLock', false);

            prevFiles.forEach((file, index) => {
                formData.append(`file${index}`, file.file);
            });

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            };
            const result = await AddHistoryEvent(`Added comment: "${message}" `, user.id, task.id);

            await axios.post(API_ENDPOINTS.CREATE_MESSAGE, formData, config);

            showNotification('Comment has been added');
            sendNotification("added a comment for", task?.id, user.id);
            setMessage('');
            if (clearFilesFn) {
                clearFilesFn();
            }
            setFiles([]);
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

    const handleDownload = async (fileUrl) => {
        try {
            const fileName = fileUrl.substring(fileUrl.indexOf('/') + 1);

            const response = await axios.get(API_ENDPOINTS.DOWNLOAD_ATTACHMENTS + fileName, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };
    return (

        <div className="col-md-8 dark-bg min-vh-100 border-start border-end border-secondary d-flex flex-column position-relative" style={{ height: 'auto' }}>

            <div className="d-flex flex-column overflow-auto" style={{ maxHeight: `calc(100vh - ${height}px)` }}>

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

                        <div key={message?.id} className='row flex-row '>
                            {message.message_sender_fk?.id !== user?.id ? (
                                message.is_lock ? (
                                    isAdmin || isSolver ? (
                                        <div className='col-md-1 mt-3'><ClickableLogo user={message.message_sender_fk} /></div>

                                    ) : (
                                        <div className='col-md-1 mt-3'></div>)

                                ) : (
                                    <div className='col-md-1 mt-3  d-flex  justify-content-end'><ClickableLogo user={message.message_sender_fk} /></div>

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
                                                <div className='dark-bg rounded '>

                                                    {message.attachments && message.attachments.length > 0 && (
                                                        <div className=" mt-1 p-2 text-secondary">Attachments:</div>
                                                    )}
                                                    {message.attachments && message.attachments.map((attachment, index) => (
                                                        <div key={index} className="mt-1 pb-1 dark-bg rounded ">
                                                            <button className="btn btn-unstyled text-secondary btn-sm" onClick={() => handleDownload(attachment.file_name)}>
                                                                {attachment.file_name.substring(attachment.file_name.indexOf('/') + 1)}
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>

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
                                            <div className='dark-bg rounded '>

                                                {message.attachments && message.attachments.length > 0 && (
                                                    <div className=" mt-1 p-2 text-secondary">Attachments:</div>
                                                )}
                                                {message.attachments && message.attachments.map((attachment, index) => (
                                                    <div key={index} className="mt-1 pb-1 dark-bg rounded ">
                                                        <button className="btn btn-unstyled text-secondary btn-sm" onClick={() => handleDownload(attachment.file_name)}>
                                                            {attachment.file_name.substring(attachment.file_name.indexOf('/') + 1)}
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
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
                <div className="container text-light mt-auto position-absolute bottom-0 mw-100" id='DragAndDropFileUploadDiv'>

                    <hr className="border-secondary" />
                    <DragAndDropFileUpload handleAddedFiles={handleAddedFiles} setClearFilesFn={setClearFilesFn} onFilesChange={handleFilesChange} />
                    <div className='col ms-3 me-3 mb-3'>
                        <div className="input-group">

                            <div className="position-relative" style={{ width: '100%' }}>
                                <textarea
                                    className="form-control"
                                    id="exampleTextarea"
                                    rows="3"
                                    placeholder="Enter your message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                ></textarea>
                                {showPredefinedPhrasesModal && (
                                    <PredefinedPhrasesModal
                                        onClose={() => setShowPredefinedPhrasesModal(false)}
                                        onSelectPhrase={handleInsertPhrase}
                                    />
                                )}
                                <Tooltip title="Use predefined phrases" placement="right-start">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary position-absolute"
                                        style={{
                                            top: '5px',
                                            right: '5px',
                                            zIndex: 1,
                                        }}
                                        onClick={handleShowPredefinedPhrasesModal}

                                    >

                                        <FontAwesomeIcon icon={faWindowRestore} />
                                    </button>
                                </Tooltip>
                                <Tooltip title="Send comment" placement="right-start">

                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary position-absolute"
                                        style={{
                                            top: '45px',
                                            right: '5px',
                                            zIndex: 1,
                                        }}
                                        onClick={updateMessage}
                                    >
                                        <FontAwesomeIcon icon={faPaperPlane} />
                                    </button>
                                </Tooltip>

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
const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = (error) => reject(error);
    });
};

export default TaskContent;
