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
    const { authState } = useAuth();
    const user = authState.user;
    const userID = user.id;
    const showNotification = useNotification();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get(API_ENDPOINTS.TASK_API, {
            params: {
                client_id: userID && userID,
                status: ['Close'],
            },
        })
            .then(response => {
                setTasks(response.data);
            })
            .catch(error => {
                showNotification('Error fetching tasks:' + error);

            });
    }, [user]);
    const additionalColumns = [

        {
            accessorKey: 'close_date',
            header: 'Closed',
            size: 140,
            Cell: ({ row }) => (row.original.close_date ? (row.original.close_date + ' ' + row.original.close_hour) : '---')

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