import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HomeColFirst from '../HomePage/HomeColFirst';
import TaskList from './TaskList';
import MenuTaskList from './MenuTaskList';
import API_ENDPOINTS from '../ApiEndpoints/apiConfig';
import { useNotification } from '../Functions/NotificationContext';

function AllOpenedTask() {
    const [tasks, setTasks] = useState([]);
    const showNotification = useNotification();

    useEffect(() => {
        axios.get(API_ENDPOINTS.TASK_API, {
            params: {
                status: ['Open'], // Use the appropriate syntax for "not equal" in your API
            },
        })
            .then(response => {
                setTasks(response.data);
            })
            .catch(error => {
                showNotification('Error fetching tasks:' + error);

            });
    }, [showNotification]);
    const additionalColumns = [
        {
            accessorKey: 'solver',
            header: 'Solver',
            size: 130,
            Cell: ({ row }) => (row.original.solver_fk ? (row.original.solver_fk.first_name + ' ' + row.original.solver_fk.last_name) : '---')

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

export default AllOpenedTask