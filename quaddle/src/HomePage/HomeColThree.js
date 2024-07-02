import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { calculateTimeDifference } from './TimeUtil';
import { Link } from 'react-router-dom';
import LogoCircleTemplate from "../Templates/LogoCircleTemplate";
import { useNotification } from '../Functions/NotificationContext';
import API_ENDPOINTS from '../ApiEndpoints/apiConfig';
import { useAuth } from '../Account/AuthContext/authContext';
import { Tooltip } from '@mui/material';

function HomeColThree() {
    const [last25Records, setlast25Records] = useState([]);
    const showNotification = useNotification();
    const { authState } = useAuth();
    const user = authState.user;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const isAdmin = user.is_admin;
                const isSolver = user.is_solver;
                const { data: { csrftoken } } = await axios.get(API_ENDPOINTS.USER_DATA);
                let response;
                if (isAdmin || isSolver) {
                    response = await axios.get(API_ENDPOINTS.NOTIFICATIONAPI, {
                        headers: {
                            'X-CSRFToken': csrftoken
                        }
                    });
                } else {
                    response = await axios.get(API_ENDPOINTS.NOTIFICATIONAPI, {
                        headers: {
                            'X-CSRFToken': csrftoken
                        },
                        params: {
                            client_id: user.id,
                        },
                    });
                }
                setlast25Records(response.data);
            } catch (error) {
                showNotification('Error fetching last 25 records:', error.message);
            }
        };

        fetchData();

        const intervalId = setInterval(() => {
            fetchData();
        }, 120000);

        return () => clearInterval(intervalId);
    }, [showNotification, user]);

    return (
        <div className="col-md-2 light-bg min-vh-100 d-flex flex-column position-relative overflow-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
            <div className="d-flex align-items-center justify-content-between p-2 dark-bg">
                <h2 className='text-light p-2'>Activity</h2>
            </div>
            <hr className="border-white m-2" />
            {last25Records.map(record => {
                const tooltipTitle = `${record.notification_date}, ${record.notification_time}`;
                return (
                    <div key={record?.id} className="card m-2 mt-1 dark-bg text-light">
                        <div className="row g-0">
                            <div className="col-md-3 p-2">
                                {LogoCircleTemplate(record.created_by_user)}
                            </div>

                            <div className="col-md-9 p-2">
                                <Link to={"/tasks/" + record.task_id} className="nav-link">
                                    <p className="card-text">{record.created_by_user.first_name} {record.created_by_user.last_name} <b>{record.notification_text}</b> <span data-bs-toggle="tooltip" title={record.task_detail.description}>{record.task_detail.title}</span></p>
                                    <span className="text-secondary">
                                        <Tooltip title={tooltipTitle} placement="right-start">
                                            {calculateTimeDifference(`${record.notification_date} ${record.notification_time}`)} ago
                                        </Tooltip>
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default HomeColThree;
