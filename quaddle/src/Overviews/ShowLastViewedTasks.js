import React, { useState, useEffect } from 'react';
import { useAuth } from '../Account/AuthContext/authContext';
import API_ENDPOINTS from '../ApiEndpoints/apiConfig';
import { useNotification } from '../Functions/NotificationContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleDot } from '@fortawesome/free-solid-svg-icons';

const ShowLastViewedTasks = () => {
    const [tasks, setTasks] = useState([]);
    const { authState } = useAuth();
    const user = authState.user;
    const userID = user?.id;
    const showNotification = useNotification();

    const handleRemove = async (taskId) => {
        try {
            const response = await axios.post(API_ENDPOINTS.DELETE_RECENTLY_VIEWED_TASKS, {
                client_id: user?.id,
                task_id: taskId
            });
            setTasks((prevTasks) => prevTasks.filter(task => task.id !== taskId));
            showNotification(response.data.message);
        } catch (error) {
            showNotification('Error removing task: ' + error);
        }
    };

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const tasksResponse = await axios.get(API_ENDPOINTS.RECENTLY_VIEWED_TASKS, {
                    params: {
                        client_id: userID,
                    },
                });
                setTasks(tasksResponse.data.tasks);
            } catch (error) {
                showNotification('Error fetching data:' + error);
            }
        };
        fetchTasks();
    }, [userID]);

    return (
        <div>
            <div style={{ overflowY: 'auto', maxHeight: '27vh' }}>
                {tasks.map((suggestion) => (
                    <React.Fragment key={suggestion.id}>
                        <div className='row g-0'>
                            <div className='col-md-10'>
                                <Link to={"/tasks/" + suggestion?.id} className="nav-link">
                                    <div className='d-flex align-items-center text-light'>
                                        <div className='col-md-2 text-center'>
                                            <FontAwesomeIcon
                                                icon={faCircleDot}
                                                style={{
                                                    color: suggestion.status_fk?.value === 'Open' ? 'orange' : suggestion.status_fk?.value === 'Close' ? '#00a347' : 'gray',
                                                }}
                                            />
                                        </div>
                                        <div className='col-md-10'>
                                            <small>
                                                <div>
                                                    <strong>{suggestion.title}</strong>
                                                </div>
                                            </small>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                            <div className='col-md-2'>
                                <button
                                    type="button"
                                    className="btn text-danger"
                                    onClick={() => handleRemove(suggestion.id)}>X
                                </button>
                            </div>
                        </div>
                        <hr className="border-secondary m-1" />
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default ShowLastViewedTasks;
