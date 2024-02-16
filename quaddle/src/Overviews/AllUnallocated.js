import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HomeColFirst from '../HomePage/HomeColFirst';
import TaskList from './TaskList';
import MenuTaskList from './MenuTaskList';
import API_ENDPOINTS from '../ApiEndpoints/apiConfig';
import { useNotification } from '../Functions/NotificationContext';

function AllUnallocated() {
    const [tasks, setTasks] = useState([]);
    const showNotification = useNotification();

    useEffect(() => {
        axios
            .get(API_ENDPOINTS.TASK_API, {
                params: {
                    status: ['Open', 'In Pendend'],
                    solver: 0,
                },
            })
            .then((response) => {
                setTasks(response.data);
            })
            .catch((error) => {
                showNotification('Error fetching tasks:' + error);

            });
    }, [showNotification]);

    const additionalColumns = [
        {
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
}

export default AllUnallocated;
