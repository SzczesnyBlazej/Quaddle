import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HomeColFirst from '../HomePage/HomeColFirst';
import TaskList from './TaskList';
import MenuTaskList from './MenuTaskList';
import { useAuth } from '../Account/AuthContext/authContext';

function MyAllClosedTask() {
    const [tasks, setTasks] = useState([]);
    const { user } = useAuth();
    const userName = user.name;
    useEffect(() => {
        axios.get(`http://localhost:3502/tasks`, {
            params: {
                solver: userName,
                status: ['Close'],
            },
        })
            .then(response => {
                setTasks(response.data);
            })
            .catch(error => {
                console.error('Error fetching tasks:', error);
            });
    }, [userName]);
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