import React, { useState, useEffect } from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleDot, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import LogoCircleTemplate from '../../Templates/LogoCircleTemplate';
import GetTasksByCustomerId from '../Functions/getTasksByCustomerId';
import findCustomerById from '../Functions/FindCustomerByID';
import LastMonthUserTasksBar from '../../Charts/LastMonthUserTasksBar';

const ClickableLogo = ({ user }) => {

    const [customerData, setCustomerData] = useState(user);
    const [tasksInProgress, setTasksInProgress] = useState([]);
    const [tasksClosed, setTasksClosed] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await findCustomerById(user.id);
                setCustomerData(data);
                const tasksInProgressData = await GetTasksByCustomerId({ clientId: user.id, taskStatus: ['Open'] });
                setTasksInProgress(tasksInProgressData);

                const tasksClosedData = await GetTasksByCustomerId({ clientId: user.id, taskStatus: ['Close'] });
                setTasksClosed(tasksClosedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, user.id]);

    const getStatusIconColor = (status) => {
        return status === 'Open' ? 'orange' : status === 'Close' ? '#00a347' : 'gray';
    };

    const renderPopover = () => (
        <Popover id={`popover-${user.id}`} className="p-3 popover">
            <div>
                <div className='row'>
                    <div className='col-md-5 d-flex align-items-center'>
                        <div>
                            {LogoCircleTemplate(customerData)}

                        </div>
                        <h5 className='ps-2'>{user.name}<br /> {user.surname}</h5>
                    </div>
                    <div className='col-md-7'>

                        <div id="email"><FontAwesomeIcon icon={faEnvelope} className='pe-2' />{user.email}</div>

                        <div id="tel"><FontAwesomeIcon icon={faPhone} className='pe-2' />{user.phone}</div>
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
                        }

                    </div>
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
                    <hr className="border-secondary" />
                    <div className='row mx-auto text-center'>
                        <label htmlFor="userChart">
                            Opened and Closed bar:
                        </label>
                        <div id="userChart">
                            <div>
                                <LastMonthUserTasksBar userId={user.id} />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </Popover>
    );


    return (
        <OverlayTrigger
            trigger="click"
            placement="right"
            rootClose
            overlay={loading ? <div>Loading</div> : renderPopover()} // Render the popover only when loading is false
        >
            <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '50px', height: '50px', backgroundColor: user?.logoColor }}
            >
                <span className="text-white fw-bold">{user?.initials}</span>
            </div>
        </OverlayTrigger>
    );
};


export default ClickableLogo;
