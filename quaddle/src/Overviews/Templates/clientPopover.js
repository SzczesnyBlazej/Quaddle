import React, { useState, useEffect } from 'react';
import { Popover } from 'react-bootstrap';
import findCustomerById from '../Functions/FindCustomerByID';
import GetTasksByCustomerId from '../Functions/getTasksByCustomerId';
import { Link } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleDot, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import LogoCircleTemplate from '../../Templates/LogoCircleTemplate';
import LastMonthUserTasksBar from '../../Charts/LastMonthUserTasksBar';
import { getStatusIconColor } from '../../Tasks/Functions';

export const ClientPopover = ({ clientId }) => {
    const [customerData, setCustomerData] = useState(null);
    const [tasksInProgress, setTasksInProgress] = useState([]);
    const [tasksClosed, setTasksClosed] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await findCustomerById(clientId);
                setCustomerData(data);

                const tasksInProgressData = await GetTasksByCustomerId({ clientId, taskStatus: ['Open'] });
                setTasksInProgress(tasksInProgressData);

                const tasksClosedData = await GetTasksByCustomerId({ clientId, taskStatus: ['Close'] });
                setTasksClosed(tasksClosedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [clientId]);


    if (!customerData) {
        return null;
    }

    return (
        <Popover id={clientId} className='p-3 popover'>
            <div>
                <div className='row'>
                    <div className='col-md-5 d-flex align-items-center'>
                        <div>
                            {LogoCircleTemplate(customerData)}

                        </div>
                        <h5 className='ps-2'>{customerData.name}<br /> {customerData.surname}</h5>
                    </div>
                    <div className='col-md-7'>

                        <div id="email"><FontAwesomeIcon icon={faEnvelope} className='pe-2' />{customerData.email}</div>

                        <div id="tel"><FontAwesomeIcon icon={faPhone} className='pe-2' />{customerData.phone}</div>
                    </div>
                </div>

                <hr className="border-secondary" />
                <div className='row'>
                    <div className='col-md-6'>
                        <label htmlFor="opened">
                            Opened:
                        </label>
                        <div id="opened" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {tasksInProgress.map(task => (
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
                        {
                            tasksInProgress.length > 0 ? (
                                <span className='text-muted'>Show more</span>
                            ) : (
                                <span className='text-muted'>No reports</span>
                            )
                        }                    </div>
                    <div className='col-md-6'>
                        <label htmlFor="closed">
                            Closed:
                        </label>
                        <div id="closed" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {tasksClosed.map(task => (
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
                        {
                            tasksClosed.length > 0 ? (
                                <span className='text-muted'>Show more</span>
                            ) : (
                                <span className='text-muted'>No reports</span>
                            )
                        }
                    </div>
                </div>
                <hr className="border-secondary" />
                <div className='row mx-auto text-center'>
                    <label htmlFor="userChart">
                        Opened and Closed bar:
                    </label>
                    <div id="userChart">
                        <div>
                            <LastMonthUserTasksBar userId={clientId} />
                        </div>
                    </div>
                </div>
            </div>
        </Popover>
    );
};