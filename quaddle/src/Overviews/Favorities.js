import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HomeColFirst from '../HomePage/HomeColFirst';
import TaskList from './TaskList';
import MenuTaskList from './MenuTaskList';
import { useAuth } from '../Account/AuthContext/authContext';
import API_ENDPOINTS from '../ApiEndpoints/apiConfig';
import { useNotification } from '../Functions/NotificationContext';

const Favorities = () => {
    const [tasks, setTasks] = useState([]);
    const { user } = useAuth();
    const userID = user.id;
    const showNotification = useNotification();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const favoritesResponse = await axios.get(API_ENDPOINTS.FAVORITIES, {
                    params: {
                        userID: userID,
                    },
                });

                if (favoritesResponse.data.length > 0) {
                    const favoritesTasksID = favoritesResponse.data[0].favoritesTasksID;
                    if (favoritesTasksID.length > 0) {
                        const tasksResponse = await axios.get(API_ENDPOINTS.TASKS, {
                            params: {
                                id: favoritesTasksID,
                            },
                        });

                        setTasks(tasksResponse.data);
                    } else {
                        setTasks([]);
                    }
                } else {
                    setTasks([]);
                }
            } catch (error) {
                showNotification('Error fetching data:' + error);
            }
        };

        fetchTasks();
    }, [userID, showNotification]);

    const additionalColumns = [{
        accessorKey: 'solver',
        header: 'Solver',
        size: 130,
    },];

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

export default Favorities;
