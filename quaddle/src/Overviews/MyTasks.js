import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HomeColFirst from '../HomePage/HomeColFirst';
import TaskList from './TaskList';
import MenuTaskList from './MenuTaskList';
import { useAuth } from '../Account/AuthContext/authContext';
import API_ENDPOINTS from '../ApiEndpoints/apiConfig';
import { useNotification } from '../Functions/NotificationContext';


const MyTasks = () => {
    const [tasks, setTasks] = useState([]);
    const { authState } = useAuth();
    const user = authState.user;
    const showNotification = useNotification();

    useEffect(() => {
        if (!user) {
            return;
        }
        axios.get(API_ENDPOINTS.TASK_API, {
            params: {
                client_id: user.id,
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

export default MyTasks;
