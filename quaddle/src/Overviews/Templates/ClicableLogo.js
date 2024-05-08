import React, { useState, useEffect } from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleDot, faPhone, faEnvelope, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import LogoCircleTemplate from '../../Templates/LogoCircleTemplate';
import GetTasksByCustomerId from '../Functions/getTasksByCustomerId';
import LastMonthUserTasksBar from '../../Charts/LastMonthUserTasksBar';
import { getStatusIconColor } from '../../Tasks/Functions';
import AllowOnlyRole from '../../Account/AuthContext/AllowOnlyRole';

const ClickableLogo = ({ user }) => {

    const [tasksInProgress, setTasksInProgress] = useState([]);
    const [tasksClosed, setTasksClosed] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleTasksInProgress, setVisibleTasksInProgress] = useState(5);
    const [visibleTasksClosed, setVisibleClosed] = useState(5);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tasksInProgressData = await GetTasksByCustomerId({ clientId: user.id, taskStatus: ['Open', 'In Pendend'] });
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
    const handleShowMoreTasksInProgress = () => {
        setVisibleTasksInProgress(prevVisibleTasks => prevVisibleTasks + 5);
    };
    const handleShowMoreTasksClosed = () => {
        setVisibleClosed(prevVisibleTasks => prevVisibleTasks + 5);
    };

    const renderPopover = () => (
        <Popover id={`popover-${user.id}`} className="p-3 popover">
            <div>
                <div className='row'>
                    <div className='col-md-5 d-flex align-items-center'>
                        <div>
                            {LogoCircleTemplate(user)}

                        </div>
                        <h5 className='ps-2'>{user.first_name}<br /> {user.last_name}</h5>
                    </div>
                    <div className='col-md-7'>

                        <div id="email"><FontAwesomeIcon icon={faEnvelope} className='pe-2' />{user.email}</div>
                        <div id="tel"><FontAwesomeIcon icon={faPhone} className='pe-2' />{user.phone}</div>
                        <div id="unit"><FontAwesomeIcon icon={faBuilding} className='pe-2' />{user.unit_fk.value}</div>
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
                            {tasksClosed.length > visibleTasksClosed && (
                                <span className='text-muted' onClick={handleShowMoreTasksClosed}>Show more</span>
                            )}
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
                </AllowOnlyRole>


            </div>
        </Popover>
    );


    return (
        <OverlayTrigger
            trigger="click"
            placement="right"
            rootClose
            overlay={loading ? <div>Loading...</div> : renderPopover()} // Render the popover only when loading is false
        >
            <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '50px', height: '50px', backgroundColor: user?.logo_color }}
            >
                <span className="text-white fw-bold">{user?.initials}</span>
            </div>
        </OverlayTrigger>
    );
};


export default ClickableLogo;
