import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HomeColFirst from '../HomePage/HomeColFirst';
import TaskList from './TaskList';
import MenuTaskList from './MenuTaskList';
import { useAuth } from '../Account/AuthContext/authContext';
import API_ENDPOINTS from '../ApiEndpoints/apiConfig';
import { useNotification } from '../Functions/NotificationContext';

function MyAllClosedTask() {
    const [tasks, setTasks] = useState([]);
    const { user } = useAuth();
    const userID = user.id;
    const showNotification = useNotification();

    useEffect(() => {
        axios.get(API_ENDPOINTS.TASKS, {
            params: {
                clientID: userID,
                status: ['Close'],
            },
        })
            .then(response => {
                setTasks(response.data);
            })
            .catch(error => {
                showNotification('Error fetching tasks:' + error);

            });
    }, [userID, showNotification]);
    const additionalColumns = [

        {
            accessorFn: (row) => `${row.closeDate} ${row.closeHour}`,
            header: 'Closed',
            size: 140,
        },
    ];

    return (
        <div>
            <div className="row g-0 ">
                <HomeColFirst />

                <MenuTaskList />

                <TaskList tasks={tasks} columnaaaaa={additionalColumns} />
            </div>
        </div>
    );
};

export default MyAllClosedTask