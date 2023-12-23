import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { calculateTimeDifference } from './TimeUtil';
import { Link } from 'react-router-dom';
import LogoCircleTemplate from "../Templates/LogoCircleTemplate";
import { useNotification } from '../Functions/NotificationContext';
import API_ENDPOINTS from '../ApiEndpoints/apiConfig';
import { useAuth } from '../Account/AuthContext/authContext';
import ifUserIsAdminBoolean from '../Account/AuthContext/ifUserIsAdminBoolean';

function HomeColThree() {
    const [last25Records, setlast25Records] = useState([]);
    const showNotification = useNotification();
    const { user } = useAuth();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const isAdmin = await ifUserIsAdminBoolean(user.id);
                if (isAdmin) {
                    const response = await axios.get(API_ENDPOINTS.NOTIFICATION, {
                        params: {
                            _sort: 'id',
                            _order: 'desc',
                            _limit: 25,
                        }
                    });
                    const recordsWithTaskDetails = await getTaskDetails(response.data);
                    setlast25Records(recordsWithTaskDetails);
                } else {
                    const taskResponse = await axios.get(API_ENDPOINTS.TASKS, {
                        params: {
                            clientID: user.id
                        }
                    });
                    const taskIds = taskResponse.data.map(task => task.id);
                    const response = await axios.get(API_ENDPOINTS.NOTIFICATION, {
                        params: {
                            _sort: 'id',
                            _order: 'desc',
                            taskId: taskIds,
                            _limit: 25,
                        }
                    });
                    const recordsWithTaskDetails = await getTaskDetails(response.data);
                    setlast25Records(recordsWithTaskDetails);
                }
            } catch (error) {
                showNotification('Error fetching last 25 records:', error.message);
            }
        };

        fetchData();

        const intervalId = setInterval(() => {
            fetchData();
        }, 120000);


        return () => clearInterval(intervalId);
    }, [showNotification, user.id]);


    const getTaskDetails = async (notifications) => {
        const tasksWithDetails = await Promise.all(
            notifications.map(async (notification) => {
                const taskId = notification.taskId;
                const taskResponse = await axios.get(API_ENDPOINTS.TASKS + `/${taskId}`);
                const taskDetails = taskResponse.data;

                const userResponse = await axios.get(API_ENDPOINTS.USERS + `/${taskDetails.clientID}`);
                const userDetails = userResponse.data;

                return {
                    ...notification,
                    taskDetails: {
                        ...taskDetails,
                        userDetails,
                    },
                };
            })
        );

        return tasksWithDetails;
    };

    return (
        <div className="col-md-2 light-bg min-vh-100 d-flex flex-column position-relative overflow-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
            <div className='dark-bg'>
                <h2 className='text-light p-2'>Activity</h2>
            </div>
            <hr className="border-white m-2" />
            {last25Records.map(record => (
                <div key={record?.id} className="card m-3 mt-1 dark-bg text-light">
                    <div className="row g-0">
                        <div className="col-md-3 p-2">

                            {LogoCircleTemplate(record.createdBy)}
                        </div>

                        <div className="col-md-9 p-2">
                            <Link to={"/tasks/" + record.taskDetails.id} className="nav-link">
                                <p className="card-text">{record.createdBy.name} {record.createdBy.surname} <b>{record.notificationText}</b> <span data-bs-toggle="tooltip" title={record.taskDetails.description}>{record.taskDetails.title}</span></p>
                                <span className="text-secondary">
                                    <h6 data-bs-toggle="tooltip" title={record.taskDetails.lastModification + ", " + record.taskDetails.lastModificationHour}>
                                        {calculateTimeDifference(`${record.notificationDate} ${record.notificationTime}`)} ago
                                    </h6></span>
                            </Link>
                        </div>


                    </div>
                </div>
            ))}
        </div>
    );
}

export default HomeColThree;
