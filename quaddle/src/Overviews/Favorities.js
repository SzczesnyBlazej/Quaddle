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
    const { authState } = useAuth();
    const user = authState.user;
    const userID = user.id;
    const showNotification = useNotification();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const favoritesResponse = await axios.get(API_ENDPOINTS.CHECK_FAVORITE, {
                    params: {
                        favorite_list: true,
                        user_id: userID,
                    },
                });
                if (favoritesResponse.data.favorite_list) {
                    const favoritesTasksID = favoritesResponse.data.favorite_list;
                    if (favoritesTasksID.length > 0) {
                        const tasksResponse = await axios.get(API_ENDPOINTS.GET_TASKS_BY_ID, {
                            params: {
                                id_list: favoritesTasksID,
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
    }, [userID]);

    const additionalColumns = [{
        accessorKey: 'solver',
        header: 'Solver',
        size: 130,
        Cell: ({ row }) => (row.original.solver_fk ? (row.original.solver_fk.first_name + ' ' + row.original.solver_fk.last_name) : '---')

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
