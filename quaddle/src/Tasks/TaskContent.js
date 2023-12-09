import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LogoCircleTemplate from '../Templates/LogoCircleTemplate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { getCurrentDateFormatted, getCurrentTimeFormatted, sendNotification } from './Functions'
import { useAuth } from '../Account/authContext';
import { useNotification } from '../Functions/NotificationContext';

const TaskContent = ({ task }) => {
    const showNotification = useNotification();

    const [clientDetail, setClientDetail] = useState([]);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const { user } = useAuth();
    const fetchMessages = async () => {
        try {
            if (task) {

                const response = await axios.get(`http://localhost:3500/messages?taskID=${task?.id}`);
                setMessages(response.data);
            }
        } catch (error) {
            showNotification('Error fetching messages:', error.message);

        }
    };
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                if (task && task.clientID) {
                    const userResponse = await axios.get(`http://localhost:3500/users/${task?.clientID}`);
                    setClientDetail(userResponse.data);
                }
            } catch (error) {
                showNotification('Error fetching user details:', error.message);

            }
        };


        fetchUserDetails();
        fetchMessages();
    }, [task?.clientID]);

    const updateMessage = async (e) => {
        e.preventDefault();

        try {
            await axios.post('http://localhost:3500/messages', {
                message: message,
                clientID: clientDetail?.id,
                taskID: task?.id,
                messageSender: user,
                createDate: getCurrentDateFormatted(),
                createHour: getCurrentTimeFormatted(),
            });

            sendNotification("added a comment for", task?.id);

            // Clear the message input after posting
            setMessage('');
            fetchMessages();

        } catch (error) {
            showNotification('Błąd podczas aktualizacji zadania:', error.message);

        }
    };

    return (
        <div className="col-md-8 dark-bg min-vh-100 border-start border-end border-secondary d-flex flex-column position-relative " style={{ maxHeight: 'calc(100vh - 180px)' }}>
            <div className="d-flex flex-column overflow-auto" style={{ maxHeight: '85vh' }}>
                <div className='container custom-width'>
                    <div className='d-flex flex-column justify-content-center align-items-center pt-5 text-secondary'>
                        {LogoCircleTemplate(clientDetail)}
                        <h2 className='ps-3 pe-3 mt-4 mb-3 ms-5 me-5 light-bg rounded'>{task?.title}</h2>
                        <p className='text-secondary'>Ticket #{task?.id} {task?.createDate} at {task?.createHour}</p>
                    </div>
                    <div className='row flex-row'>
                        <div className='col-md-1'></div>
                        <div className='col-md-10 d-flex flex row justify-content-between'>
                            <span
                                className={`pt-3 pb-3 mt-3 mb-3 ps-3 pe-3 text-light light-bg rounded w-100 ${user?.id === task?.clientID ? 'green-border' : ''
                                    }`}
                            >
                                {task?.description}
                            </span>
                            <p className="card-text text-secondary text-center"><small >{task?.createDate} at {task?.createHour}</small></p>

                        </div>
                        <div className='col-md-1'>{LogoCircleTemplate(clientDetail)}</div>
                    </div>
                    {messages.map((message) => (
                        <div key={message?.id} className='row flex-row'>
                            {message.messageSender?.id !== user?.id ? (
                                <div className='col-md-1 mt-3'>{LogoCircleTemplate(message.messageSender)}</div>
                            ) : (
                                <div className='col-md-1'></div>
                            )}
                            <div className='col-md-10 d-flex flex row justify-content-between'>
                                <span
                                    className={`pt-3 pb-3 mt-3 mb-3 ps-3 pe-3 text-light light-bg rounded w-100 ${message.messageSender?.id === user?.id ? 'green-border' : ''
                                        }`}
                                >
                                    {message.message}
                                </span>
                                <p className="card-text text-secondary text-center"><small >{message?.createDate} at {message?.createHour}</small></p>

                            </div>

                            {message.messageSender?.id === user?.id ? (
                                <div className='col-md-1 mt-3'>{LogoCircleTemplate(message.messageSender)}</div>
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
            </div>
        </div>
    );
};

export default TaskContent;
