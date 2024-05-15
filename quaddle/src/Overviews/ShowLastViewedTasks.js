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
    const userID = user.id;
    const showNotification = useNotification();
    const renderSuggestion = (suggestion) => (
        <div>
            <strong>{suggestion.title}</strong>
        </div>
    );
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                console.log(user.recently_viewed_tasks.length)
                if (user.recently_viewed_tasks.length > 0) {
                    const tasksResponse = await axios.get(API_ENDPOINTS.GET_TASKS_BY_ID, {
                        params: {
                            id_list: user.recently_viewed_tasks,
                        },
                    });
                    setTasks(tasksResponse.data);

                }

            } catch (error) {
                showNotification('Error fetching data:' + error);
            }
        };

        fetchTasks();
    }, [userID]);



    return (
        <div>
            <div className="row g-0 ">
                {tasks.length > 0 ? <strong className='text-white text-center'>Last viewed tasks</strong> : ''}
                {tasks.map((tasks) => (
                    <React.Fragment key={tasks.id}>
                        <Link to={"/tasks/" + tasks?.id} className="nav-link">
                            <div className='d-flex align-items-center text-light'>
                                <div className='col-md-2 text-center'>
                                    <FontAwesomeIcon
                                        icon={faCircleDot}
                                        style={{
                                            color: tasks.status_fk.value === 'Open' ? 'orange' : tasks.status_fk.value === 'Close' ? '#00a347' : 'gray',
                                        }}
                                    />
                                </div>

                                <div className='col-md-10'>
                                    <small >
                                        {renderSuggestion(tasks)}
                                    </small>
                                </div>
                            </div>
                        </Link>
                        <hr className="border-secondary" />
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default ShowLastViewedTasks;
