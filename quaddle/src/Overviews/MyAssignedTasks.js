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
    const { user } = useAuth();
    const userName = user.name;
    const showNotification = useNotification();

    useEffect(() => {

        axios.get(API_ENDPOINTS.TASKS, {
            params: {
                solver: userName,
                status: ['Open', 'In Pendend'], // Use the appropriate syntax for "not equal" in your API
            },
        })
            .then(response => {
                setTasks(response.data);

            })
            .catch(error => {
                showNotification('Error fetching tasks:' + error);


            });
    }, [userName, showNotification]);
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
