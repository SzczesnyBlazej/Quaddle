// TaskPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import HomeColFirst from '../HomePage/HomeColFirst';
import TaskContent from './TaskContent';
import TaskDetail from './TaskDetail';

const TaskPage = () => {
    const { taskId } = useParams();
    const [task, setTask] = useState(null);

    useEffect(() => {
        const fetchTaskById = async () => {
            try {
                const response = await axios.get(`http://localhost:3500/tasks/${taskId}`);
                setTask(response.data);
            } catch (error) {
                console.error(`Error fetching task with ID ${taskId}:`, error.message);
            }
        };

        fetchTaskById();
    }, [taskId]);

    return (
        <div>
            <div className="row g-0 ">
                <HomeColFirst />
                <TaskContent task={task} />
                <TaskDetail task={task} />

            </div>
        </div>
    );
};

export default TaskPage;
