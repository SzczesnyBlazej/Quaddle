import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import HomeColFirst from '../HomePage/HomeColFirst';
import TaskContent from './TaskContent';
import TaskDetail from './TaskDetail';
import { useNotification } from '../Functions/NotificationContext';
import API_ENDPOINTS from '../ApiEndpoints/apiConfig';
import { useAuth } from '../Account/AuthContext/authContext';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { getCurrentDateFormatted, getCurrentTimeFormatted } from './Functions';
import Cookies from 'js-cookie';

const TaskPage = () => {
    const { taskId } = useParams();
    const [task, setTask] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const showNotification = useNotification();
    const { authState } = useAuth();
    const user = authState.user;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;

            try {
                await axios.post(API_ENDPOINTS.ADD_RECENTLY_VIEWED_TASKS, {
                    client_id: user?.id,
                    task_id: taskId
                });

                await axios.post(API_ENDPOINTS.CREATE_RECENTLY_VISITORS, {
                    createdBy: user.id,
                    task_id: taskId,
                    createDate: getCurrentDateFormatted(),
                    createHour: getCurrentTimeFormatted()
                });

                const accessToken = Cookies.get('access_token');

                await axios.post(API_ENDPOINTS.MARK_AS_READ_NOTIFICATION_FOR_USER_BADGE, {
                    notification_id: taskId,
                    owner_id: user.id
                }, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                const taskResponse = await axios.get(API_ENDPOINTS.TASK_API + `${taskId}`);
                const fetchedTask = taskResponse.data;
                const isAdmin = user.is_admin;
                const isSolver = user.is_solver;

                if (isAdmin || isSolver || fetchedTask.client_fk.id === user.id) {
                    setTask(fetchedTask);
                } else {
                    showNotification(`No permission to view this task`);
                    navigate('/');
                }
            } catch (error) {
                showNotification(`Error fetching task with ID ${taskId}: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [user, taskId, navigate, showNotification]);

    return (
        <div>
            <div className="row g-0">
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <HomeColFirst />
                        <TaskContent task={task} />
                        <TaskDetail task={task} />
                    </>
                )}
            </div>
        </div>
    );
};

export default TaskPage;
