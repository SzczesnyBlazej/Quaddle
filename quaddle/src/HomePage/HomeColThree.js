import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { calculateTimeDifference } from './TimeUtil';
import { Link } from 'react-router-dom';
import LogoCircleTemplate from "../Templates/LogoCircleTemplate";
import { useNotification } from '../Functions/NotificationContext';

function HomeColThree() {
    const [last10Records, setLast10Records] = useState([]);
    const showNotification = useNotification();

    const fetchData = async () => {
        try {

            const response = await axios.get('http://localhost:3503/notification?_sort=id&_order=desc&_limit=25');
            const recordsWithTaskDetails = await getTaskDetails(response.data);

            setLast10Records(recordsWithTaskDetails);
        } catch (error) {
            showNotification('Error fetching last 25 records:', error.message);

        }
    };

    useEffect(() => {
        fetchData();

        const intervalId = setInterval(() => {
            fetchData();
        }, 120000);

        return () => clearInterval(intervalId);
    }, []);

    const getTaskDetails = async (notifications) => {
        const tasksWithDetails = await Promise.all(
            notifications.map(async (notification) => {
                const taskId = notification.taskId;
                const taskResponse = await axios.get(`http://localhost:3502/tasks/${taskId}`);
                const taskDetails = taskResponse.data;

                const userResponse = await axios.get(`http://localhost:3501/users/${taskDetails.clientID}`);
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



            {last10Records.map(record => (
                <div key={record?.id} className="card m-3 mt-1 dark-bg text-light">
                    <div className="row g-0">
                        <div className="col-md-3 p-2">
                            {LogoCircleTemplate(record.createdBy)}

                        </div>

                        <div className="col-md-9 p-2">
                            <Link to={"/tasks/" + record.taskDetails?.id} className="nav-link">
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
