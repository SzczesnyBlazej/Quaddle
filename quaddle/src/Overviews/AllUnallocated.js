import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HomeColFirst from '../HomePage/HomeColFirst';
import TaskList from './TaskList';
import MenuTaskList from './MenuTaskList';

function AllUnallocated() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        axios
            .get(`http://localhost:3502/tasks`, {
                params: {
                    status: ['Open', 'In Pendend'],
                    solver: '',
                },
            })
            .then((response) => {
                setTasks(response.data);
            })
            .catch((error) => {
                console.error('Error fetching tasks:', error);
            });
    }, []);

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
