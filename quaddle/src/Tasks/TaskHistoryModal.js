import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useNotification } from '../Functions/NotificationContext';
import axios from 'axios';
import API_ENDPOINTS from '../ApiEndpoints/apiConfig';
import CircularProgress from '@mui/material/CircularProgress';
import TaskLastViewedModal from './TaskLastViewedModal';
import AllowOnlyRole from '../Account/AuthContext/AllowOnlyRole';

const TaskHistoryModal = ({ taskId, onClose }) => {
    const [task, setTask] = useState(null);
    const [history, setHistory] = useState([]);
    const showNotification = useNotification();
    const [showTaskHistoryModal, setShowTaskHistoryModal] = useState(true);
    const [showLastViewedModal, setShowLastViewedModal] = useState(false);

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

        const fetchHistory = async () => {
            try {
                const response = await axios.get(API_ENDPOINTS.GET_TASK_HISTORY, {
                    params: {
                        task_id: taskId,
                    },
                });
                setHistory(response.data);
            } catch (error) {
                showNotification(`Error fetching task history with ID ${taskId}`);
            }
        };

        fetchData();
        fetchHistory();
    }, [taskId, showNotification]);

    const handleShowLastViewedButtonClick = () => {
        setShowTaskHistoryModal(false);
        setTimeout(() => {
            setShowLastViewedModal(true);
        }, 300);
    };

    const handleCloseLastViewedModal = () => {
        setShowLastViewedModal(false);
        setShowTaskHistoryModal(true);
    };

    return (
        <>
            <Modal show={showTaskHistoryModal} onHide={onClose}>
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
                                Task created by: {task.client_fk ? `${task.client_fk.first_name} ${task.client_fk.last_name} (${task.client_fk.username})` : "Unknown"}
                                <br />
                                Created at: {`${task.create_date}, ${task.create_hour}`}
                            </p>
                            <h5>Full history</h5>
                            {history.map((message) => (
                                <div className="p-2" key={message.id}>
                                    <b>{`${message.create_date}, ${message.create_hour}`}</b>
                                    <p>{message.client_fk.last_name} {message.client_fk.first_name} ({message.client_fk.username}) {message.message}</p>
                                    <hr />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <CircularProgress />
                    )}
                </Modal.Body>
                <AllowOnlyRole roles={["admin", "solver"]}>
                    <Modal.Footer>
                        <button className="btn btn-outline-dark m-2" type="button" onClick={handleShowLastViewedButtonClick}>
                            Show recent visitors
                        </button>
                    </Modal.Footer>
                </AllowOnlyRole>
            </Modal>
            {showLastViewedModal && (
                <TaskLastViewedModal
                    taskId={taskId}
                    onClose={handleCloseLastViewedModal}
                />
            )}
        </>
    );
};

export default TaskHistoryModal;
