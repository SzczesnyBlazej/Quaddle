import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useNotification } from '../Functions/NotificationContext';
import axios from 'axios';
import API_ENDPOINTS from '../ApiEndpoints/apiConfig';

const TaskHistoryModal = ({ taskId, onClose }) => {
    const [task, setTask] = useState(null);
    const showNotification = useNotification();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const taskResponse = await axios.get(`${API_ENDPOINTS.TASK_API}${taskId}`);
                const fetchedTask = taskResponse.data;

                setTask(fetchedTask);
            } catch (error) {
                showNotification(`Error fetching task with ID ${taskId}`);
            }
        };

        fetchData();
    }, [taskId, showNotification]);

    return (
        <Modal show={true} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {task ? `History of task '${task.title}' (ID: ${taskId})` : `Loading...`}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {task ? (
                    <div className="form-group">
                        <h5>Primary data</h5>
                        <p className="p-2">
                            Created by: {task ? `${task.client_fk.first_name} ${task.client_fk.last_name} (${task.client_fk.username})` : ""}
                            <br></br>
                            Created at: {task ? `${task.create_date}, ${task.create_hour}` : ''}
                        </p>
                        <h5 className='p-2'>Full history</h5>
                    </div>
                ) : (
                    <p>Loading task data...</p>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default TaskHistoryModal;
