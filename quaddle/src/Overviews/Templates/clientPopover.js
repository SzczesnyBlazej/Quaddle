import React, { useState, useEffect } from 'react';
import { Popover } from 'react-bootstrap';
import GetTasksByCustomerId from '../Functions/getTasksByCustomerId';
import { Link } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleDot, faPhone, faEnvelope, faBuilding } from '@fortawesome/free-solid-svg-icons';
import LogoCircleTemplate from '../../Templates/LogoCircleTemplate';
import LastMonthUserTasksBar from '../../Charts/LastMonthUserTasksBar';
import { getStatusIconColor } from '../../Tasks/Functions';
import AllowOnlyRole from '../../Account/AuthContext/AllowOnlyRole';
import API_ENDPOINTS from '../../ApiEndpoints/apiConfig';
import axios from 'axios';

export const ClientPopover = ({ client }) => {
    const [tasksInProgress, setTasksInProgress] = useState([]);
    const [tasksClosed, setTasksClosed] = useState([]);
    const clientID = client.id
    const [visibleTasksInProgress, setVisibleTasksInProgress] = useState(5);
    const [visibleTasksClosed, setVisibleClosed] = useState(5);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tasksInProgressData = await GetTasksByCustomerId({ clientId: client.id, taskStatus: ['Open', 'In Pendend'] });
                setTasksInProgress(tasksInProgressData);

                const tasksClosedData = await GetTasksByCustomerId({ clientId: client.id, taskStatus: ['Close'] });
                setTasksClosed(tasksClosedData);

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [client]);
    const handleShowMoreTasksInProgress = () => {
        setVisibleTasksInProgress(prevVisibleTasks => prevVisibleTasks + 5);
    };
    const handleShowMoreTasksClosed = () => {
        setVisibleClosed(prevVisibleTasks => prevVisibleTasks + 5);
    };


    if (!client) {
        return null;
    }

    return (
        <Popover id={client.id} className='p-3 popover'>
            <div>
                <div className='row'>
                    <div className='col-md-5 d-flex align-items-center'>
                        <div>
                            {LogoCircleTemplate(client)}

                        </div>
                        <h5 className='ps-2'>{client.first_name}<br /> {client.last_name}</h5>
                    </div>
                    <div className='col-md-7'>

                        <div id="email"><FontAwesomeIcon icon={faEnvelope} className='pe-2' />{client.email}</div>

                        <div id="tel"><FontAwesomeIcon icon={faPhone} className='pe-2' />{client.phone}</div>
                        <div id="unit"><FontAwesomeIcon icon={faBuilding} className='pe-2' />{client.unit}</div>

                    </div>
                </div>

                <hr className="border-secondary" />
                <AllowOnlyRole roles={["admin", "solver"]}>
                    <div className='row'>
                        <div className='col-md-6'>
                            <label htmlFor="opened">
                                Opened ({tasksInProgress.length})
                            </label>
                            <div id="opened" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {tasksInProgress.slice(0, visibleTasksInProgress).map(task => (
                                    <div key={task.id} className="d-flex align-items-center">
                                        <FontAwesomeIcon
                                            icon={faCircleDot}
                                            style={{
                                                color: getStatusIconColor(task.status),
                                                marginRight: '5px',
                                            }}
                                        />
                                        <div>
                                            <Link to={`/tasks/${task.id}`} className="nav-link">
                                                <div
                                                    data-tooltip-id="my-tooltip-styles"
                                                    data-tooltip-content={task.title}
                                                    className="truncate-text"
                                                    style={{
                                                        display: 'inline-block',
                                                        maxHeight: '30px',
                                                        maxWidth: '100%',
                                                        overflow: 'hidden',
                                                        whiteSpace: 'nowrap',
                                                        textOverflow: 'ellipsis',
                                                    }}
                                                >
                                                    {task.title}
                                                </div>
                                                <Tooltip id="my-tooltip-styles" arrowColor="transparent" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {tasksInProgress.length > visibleTasksInProgress && (
                                <span className='text-muted' onClick={handleShowMoreTasksInProgress}>Show more</span>
                            )}
                        </div>
                        <div className='col-md-6'>
                            <label htmlFor="closed">
                                Closed ({tasksClosed.length})
                            </label>
                            <div id="closed" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {tasksClosed.slice(0, visibleTasksClosed).map(task => (
                                    <div key={task.id} className="d-flex align-items-center">
                                        <FontAwesomeIcon
                                            icon={faCircleDot}
                                            style={{
                                                color: getStatusIconColor(task && task.status),
                                                marginRight: '5px',
                                            }}
                                        />
                                        <div>
                                            <Link to={`/tasks/${task.id}`} className="nav-link">
                                                <div
                                                    data-tooltip-id="my-tooltip-styles"
                                                    data-tooltip-content={task.title}
                                                    className="truncate-text"
                                                    style={{
                                                        display: 'inline-block',
                                                        maxHeight: '30px',
                                                        maxWidth: '100%',
                                                        overflow: 'hidden',
                                                        whiteSpace: 'nowrap',
                                                        textOverflow: 'ellipsis',
                                                    }}
                                                >
                                                    {task.title}
                                                </div>
                                                <Tooltip id="my-tooltip-styles" arrowColor="transparent" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {tasksClosed.length > visibleTasksClosed && (
                                <span className='text-muted' onClick={handleShowMoreTasksClosed}>Show more</span>
                            )}
                        </div>
                    </div>
                    <hr className="border-secondary" />
                    <div className='row mx-auto text-center'>
                        <label htmlFor="userChart">
                            Opened and Closed bar:
                        </label>
                        <div id="userChart">
                            <div>
                                <LastMonthUserTasksBar userId={client.id} />
                            </div>
                        </div>
                    </div>
                </AllowOnlyRole>
            </div>
        </Popover>
    );
};
