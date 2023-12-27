import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import HomeColFirst from '../HomePage/HomeColFirst';
import TaskContent from './TaskContent';
import TaskDetail from './TaskDetail';
import { useNotification } from '../Functions/NotificationContext';
import API_ENDPOINTS from '../ApiEndpoints/apiConfig';
import { useAuth } from '../Account/AuthContext/authContext';
import ifUserIsAdminBoolean from '../Account/AuthContext/ifUserIsAdminBoolean';
import ifUserIsSolverBoolean from '../Account/AuthContext/ifUserIsSolverBoolean';

const TaskPage = () => {
    const { taskId } = useParams();
    const [task, setTask] = useState(null);
    const showNotification = useNotification();
    const { user } = useAuth();
    const userID = user.id;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [isAdmin, isSolver, taskResponse] = await Promise.all([
                    ifUserIsAdminBoolean(userID),
                    ifUserIsSolverBoolean(userID),
                    axios.get(API_ENDPOINTS.TASKS + `/${taskId}`)
                ]);

                const fetchedTask = taskResponse.data;

                if (isAdmin || isSolver || fetchedTask.clientID === userID) {
                    setTask(fetchedTask);
                } else {
                    showNotification(`No permission to view this task`);
                    navigate('/');
                }
            } catch (error) {
                showNotification(`Error fetching task with ID ${taskId}: ${error.message}`);
            }
        };

        fetchData();
    }, [taskId, showNotification, navigate, userID]);

    return (
        <div>
            <div className="row g-0">
                <HomeColFirst />
                <TaskContent task={task} />
                <TaskDetail task={task} />
            </div>
        </div>
    );
};

export default TaskPage;
