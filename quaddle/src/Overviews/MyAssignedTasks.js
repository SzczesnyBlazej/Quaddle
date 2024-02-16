import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HomeColFirst from '../HomePage/HomeColFirst';
import TaskList from './TaskList';
import MenuTaskList from './MenuTaskList';
import { useAuth } from '../Account/AuthContext/authContext';
import API_ENDPOINTS from '../ApiEndpoints/apiConfig';
import { useNotification } from '../Functions/NotificationContext';


const MyAssignedTasks = () => {
    const [tasks, setTasks] = useState([]);
    const { authState } = useAuth();
    const user = authState.user;
    const userID = user.id;
    const showNotification = useNotification();
    useEffect(() => {
        axios.get(API_ENDPOINTS.TASK_API, {
            params: {
                solver: userID && userID,
                status: ['Open', 'In Pendend'],
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

export default MyAssignedTasks;
