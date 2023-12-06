import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HomeColFirst from '../HomePage/HomeColFirst';
import TaskList from './TaskList';
import MenuTaskList from './MenuTaskList';
import { useAuth } from '../Account/authContext';

const MyTasks = () => {
    const [tasks, setTasks] = useState([]);
    const { user } = useAuth();
    const userName = user.name;
    useEffect(() => {
        axios.get(`http://localhost:3500/tasks`, {
            params: {
                solver: userName,
                status: ['Open', 'In Pendend'], // Use the appropriate syntax for "not equal" in your API
            },
        })
            .then(response => {
                setTasks(response.data);
            })
            .catch(error => {
                console.error('Error fetching tasks:', error);
            });
    }, []);
    const additionalColumns = [
        {
            accessorKey: 'solver',
            header: 'Solver',
            size: 130,
        }
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
