import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getCurrentDateFormatted, getCurrentTimeFormatted, sendNotification } from './Functions';
import { useNotification } from '../Functions/NotificationContext';
import API_ENDPOINTS from '../ApiEndpoints/apiConfig';
import { useAuth } from '../Account/AuthContext/authContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { checkIsTaskFavorite, toggleTaskFavorite } from './FavoriteService';
import AllowOnlyRole from '../Account/AuthContext/AllowOnlyRole';
import getSolverList from '../Account/UserManagement/getSolverList';
import getOptions from '../Config/getOptions';
import TaskHistoryModal from '../Tasks/TaskHistoryModal';
import { AddHistoryEvent } from './addHistoryEvent';
import { Tooltip } from '@mui/material';
const TaskDetail = ({ task }) => {
    const showNotification = useNotification();
    const { authState } = useAuth();
    const user = authState.user;
    const [isTaskFavorite, setIsTaskFavorite] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSolver, setIsSolver] = useState(false);
    const [solverList, setSolverList] = useState([]);
    const [selectedSolver, setSelectedSolver] = useState('');
    const [selectedPriority, setSelectedPriority] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('');
    const [selectedUnit, setSelectedUnit] = useState('');
    const [selectedPhoneNumber, setSelectedPhoneNumber] = useState('');
    const [priorityOptions, setPriorityOptions] = useState([]);
    const [difficultyOptions, setDifficultyOptions] = useState([]);
    const [statusOptions, setStatusOptions] = useState([]);
    const [unitsOptions, setUnitsOptions] = useState([]);
    const [showHistoryModal, setShowHistoryModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    solverListData,
                    priorityList,
                    difficultyList,
                    statusList,
                    unitList
                ] = await Promise.all([
                    getSolverList(),
                    getOptions('Priority'),
                    getOptions('Difficulty'),
                    getOptions('Status'),
                    getOptions('Unit')
                ]);

                setSolverList(solverListData);
                setPriorityOptions(priorityList);
                setDifficultyOptions(difficultyList);
                setStatusOptions(statusList);
                setUnitsOptions(unitList);

                const adminStatus = user?.is_admin || false;
                const solverStatus = user?.is_solver || false;
                setIsSolver(solverStatus);
                setIsAdmin(adminStatus);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (task && user) {
            setSelectedSolver(task.solver || '');
            setSelectedPriority(task.priority || '');
            setSelectedStatus(task.status || '');
            setSelectedDifficulty(task.difficulty || '');
            setSelectedUnit(task.unit || '');
            setSelectedPhoneNumber(task.client_fk.phone || '');

            checkIsTaskFavorite(user.id, task.id)
                .then((result) => setIsTaskFavorite(result))
                .catch((error) => console.error('Error checking task favorite status:', error));
        }

        fetchData();
    }, [task, user]);

    const handleInputChange = (e, setterFunction) => {
        setterFunction(e.target.value);
    };

    const handleShowHistoryButtonClick = () => {
        setShowHistoryModal(true);
    };

    const dropdownOptions = (options) => (
        <>
            <option value="">---</option>
            {options.map((option) => (
                <option key={option.id} value={option.id}>
                    {option.value}
                </option>
            ))}
        </>
    );

    const dropdownOptionsUsers = (options) => (
        <>
            <option value="">---</option>
            {options.map((option) => (
                <option key={option.id} value={option.id}>
                    {option.first_name} {option.last_name}
                </option>
            ))}
        </>
    );

    const acceptTask = async () => {
        try {
            const { data: csrfToken } = await axios.get(API_ENDPOINTS.USER_DATA);

            const acceptTaskData = {
                solver: user.id,
                priority: selectedPriority,
                status: selectedStatus,
                difficulty: selectedDifficulty,
                unit: selectedUnit,
                contactNumber: selectedPhoneNumber,
                last_modification_hour: getCurrentTimeFormatted(),
                last_modification: getCurrentDateFormatted(),
            };

            sendNotification('Updated post', task?.id, user.id);
            const changes = [];
            if (task.solver !== acceptTaskData.solver) changes.push(`Solver: ${task.solver} -> ${acceptTaskData.solver}`);
            if (task.priority !== acceptTaskData.priority) changes.push(`Priority: ${task.priority} -> ${acceptTaskData.priority}`);
            if (task.status !== acceptTaskData.status) changes.push(`Status: ${task.status} -> ${acceptTaskData.status}`);
            if (task.difficulty !== acceptTaskData.difficulty) changes.push(`Difficulty: ${task.difficulty} -> ${acceptTaskData.difficulty}`);
            if (task.unit !== acceptTaskData.unit) changes.push(`Unit: ${task.unit} -> ${acceptTaskData.unit}`);

            const changeMessage = `Accepted task with changes: ${changes.join(', ')}`;
            await AddHistoryEvent(changeMessage, user.id, task.id);

            const response = await axios.put(
                `${API_ENDPOINTS.UPDATE_TASK}/${task?.id}`,
                acceptTaskData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken,
                    },
                }
            );

            if (response.data) {
                setSelectedStatus(acceptTaskData.status);
                showNotification('Task accepted successfully.');
            } else {
                showNotification('Failed to accept task.');
            }

        } catch (error) {
            showNotification('Error updating task:', error.message);
        }
    };

    const updateTask = async () => {
        try {
            const { data: csrfToken } = await axios.get(API_ENDPOINTS.USER_DATA);

            const updatedTaskData = {
                solver: selectedSolver,
                priority: selectedPriority,
                status: selectedStatus,
                difficulty: selectedDifficulty,
                unit: selectedUnit,
                contactNumber: selectedPhoneNumber,
                last_modification_hour: getCurrentTimeFormatted(),
                last_modification: getCurrentDateFormatted(),
            };

            const changes = [];
            if (task.solver !== updatedTaskData.solver) changes.push(`Solver: ${task.solver} -> ${updatedTaskData.solver}`);
            if (task.priority !== updatedTaskData.priority) changes.push(`Priority: ${task.priority} -> ${updatedTaskData.priority}`);
            if (task.status !== updatedTaskData.status) changes.push(`Status: ${task.status} -> ${updatedTaskData.status}`);
            if (task.difficulty !== updatedTaskData.difficulty) changes.push(`Difficulty: ${task.difficulty} -> ${updatedTaskData.difficulty}`);
            if (task.unit !== updatedTaskData.unit) changes.push(`Unit: ${task.unit} -> ${updatedTaskData.unit}`);

            const changeMessage = `Updated task with changes: ${changes.join(', ')}`;
            await AddHistoryEvent(changeMessage, user.id, task.id);
            sendNotification('Updated post', task?.id, user.id);

            await axios.put(
                `${API_ENDPOINTS.UPDATE_TASK}/${task?.id}`,
                updatedTaskData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken,
                    },
                }
            );

            showNotification('Task updated successfully.');
        } catch (error) {
            showNotification('Error updating task: ' + error.message);
        }
    };

    const closeTask = async () => {
        try {
            const updatedTaskData = {
                priority: selectedPriority,
                difficulty: selectedDifficulty,
                unit: selectedUnit,
                contactNumber: selectedPhoneNumber,
                lastModificationHour: getCurrentTimeFormatted(),
                lastModification: getCurrentDateFormatted(),
                status: 8,
                close_date: getCurrentDateFormatted(),
                close_hour: getCurrentTimeFormatted(),
            };

            if (isAdmin) {
                updatedTaskData.solver = user.id;
            }

            const { data: csrfToken } = await axios.get(API_ENDPOINTS.USER_DATA);

            const changeMessage = `Closed post by ${user.first_name} ${user.last_name}`;
            await AddHistoryEvent(changeMessage, user.id, task.id);

            const response = await axios.put(
                `${API_ENDPOINTS.UPDATE_TASK}/${task?.id}`,
                updatedTaskData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken,
                    },
                }
            );

            if (response.data) {
                setSelectedStatus(updatedTaskData.status);
                showNotification('Task closed successfully.');
            } else {
                showNotification('Failed to close task.');
            }

        } catch (error) {
            showNotification('Error closing task: ' + error.message);
        }
    };

    const handleToggleFavorite = async () => {
        try {
            const success = await toggleTaskFavorite(user, task, isTaskFavorite, setIsTaskFavorite);
            const changeMessage = `Changed favorites to ${!isTaskFavorite}`;
            await AddHistoryEvent(changeMessage, user.id, task.id);
            showNotification(success.message);
        } catch (error) {
            showNotification('Error toggling favorite:' + error);
        }
    };

    return (
        <div className="col-md-2 light-bg min-vh-100 d-flex flex-column position-relative overflow-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
            <form>
                <div className="container text-light">
                    <div className="d-flex align-items-center justify-content-between p-2">
                        <h2 className="mb-0">Task</h2>
                        <div className="ms-auto d-flex align-items-center">
                            <button
                                type="button"
                                className="btn rounded-circle border-0"
                                onClick={handleShowHistoryButtonClick}
                            >
                                <div className="btn d-flex align-items-center justify-content-center">
                                    <span>
                                        <Tooltip title={'Show task history'}
                                            placement="right-start">
                                            <FontAwesomeIcon
                                                icon={faClockRotateLeft}
                                                style={{ cursor: 'pointer', color: 'white' }}
                                                size="xl"
                                            />
                                        </Tooltip>
                                    </span>
                                </div>
                            </button>
                            {showHistoryModal && <TaskHistoryModal taskId={task ? task.id : null} onClose={() => setShowHistoryModal(false)} />}
                            <Tooltip title={isTaskFavorite ? 'Click to remove from favorites' : 'Click to add to favorites'} placement="right-start">

                                <FontAwesomeIcon
                                    icon={isTaskFavorite ? faStar : faStarRegular}
                                    style={{ color: isTaskFavorite ? 'gold' : 'inherit', cursor: 'pointer', marginLeft: '10px' }}
                                    size="xl"

                                    onClick={handleToggleFavorite}
                                />
                            </Tooltip>
                        </div>
                    </div>
                    <hr className="border-secondary" />
                    <div className="form-group p-1">
                        <label htmlFor="solverInput">Solver</label>
                        <select
                            className="form-control form-select"
                            id="solverInput"
                            aria-describedby="emailHelp"
                            value={selectedSolver}
                            onChange={(e) => handleInputChange(e, setSelectedSolver)}
                            aria-label="Solver"
                            disabled={!isSolver && !isAdmin}
                        >
                            {dropdownOptionsUsers(solverList)}
                        </select>
                    </div>
                    <div className="form-group p-1">
                        <label htmlFor="createDateTimeInput">Create Date and Time</label>
                        <div className="d-flex">
                            <input
                                type="text"
                                className="form-control me-2"
                                id="createDateInput"
                                value={task?.create_date || ''}
                                readOnly
                            />
                            <input
                                type="text"
                                className="form-control"
                                id="createHourInput"
                                value={task?.create_hour || ''}
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="form-group p-1">
                        <label htmlFor="lastModificationDateTimeInput">Last Modification Date and Time</label>
                        <div className="d-flex">
                            <input
                                type="text"
                                className="form-control me-2"
                                id="lastModificationDateInput"
                                value={task?.last_modification || ''}
                                readOnly
                            />
                            <input
                                type="text"
                                className="form-control"
                                id="lastModificationHourInput"
                                value={task?.last_modification_hour || ''}
                                readOnly
                            />
                        </div>
                    </div>
                    <AllowOnlyRole roles={["admin", "solver"]}>
                        <div className="form-group p-1">
                            <label htmlFor="priorityInput">Priority</label>
                            <select
                                className="form-control form-select"
                                id="priorityInput"
                                aria-describedby="emailHelp"
                                value={selectedPriority}
                                onChange={(e) => handleInputChange(e, setSelectedPriority)}
                                aria-label="Priority"
                            >
                                {dropdownOptions(priorityOptions)}
                            </select>
                        </div>
                        <div className="form-group p-1">
                            <label htmlFor="difficultyInput">Difficulty</label>
                            <select
                                className="form-control form-select"
                                id="difficultyInput"
                                aria-describedby="emailHelp"
                                value={selectedDifficulty}
                                onChange={(e) => handleInputChange(e, setSelectedDifficulty)}
                                aria-label="Difficulty"
                            >
                                {dropdownOptions(difficultyOptions)}
                            </select>
                        </div>
                    </AllowOnlyRole>
                    <div className="form-group p-1">
                        <label htmlFor="statusInput">Status</label>
                        <select
                            className="form-control form-select"
                            id="statusInput"
                            aria-describedby="emailHelp"
                            value={selectedStatus}
                            onChange={(e) => handleInputChange(e, setSelectedStatus)}
                            aria-label="Status"
                            disabled={!isSolver && !isAdmin}
                        >
                            {dropdownOptions(statusOptions)}
                        </select>
                    </div>
                    <div className="form-group p-1">
                        <label htmlFor="unitInput">Unit</label>
                        <select
                            className="form-control form-select"
                            id="unitInput"
                            aria-describedby="emailHelp"
                            value={selectedUnit}
                            onChange={(e) => handleInputChange(e, setSelectedUnit)}
                            aria-label="Unit"
                        >
                            {dropdownOptions(unitsOptions)}
                        </select>
                    </div>
                    <div className="form-group p-1">
                        <label htmlFor="phoneInput">Phone</label>
                        <input
                            type="text"
                            className="form-control"
                            id="phoneInput"
                            aria-describedby="emailHelp"
                            value={selectedPhoneNumber}
                            onChange={(e) => handleInputChange(e, setSelectedPhoneNumber)}
                            aria-label="Phone"
                        />
                    </div>
                </div>
                <div className="container text-light mt-auto position-absolute bottom-0 w-100 justify-content-center">
                    <hr className="border-secondary" />
                    <div className="row">
                        <div className="col-md-4 d-flex justify-content-center">
                            <AllowOnlyRole roles={["admin", "solver"]}>
                                <button className="btn btn-outline-light m-2" type="button" onClick={acceptTask}>
                                    Accept
                                </button>
                            </AllowOnlyRole>
                        </div>
                        <div className="col-md-4 d-flex justify-content-center">
                            <button className="btn btn-outline-light m-2" type="button" onClick={closeTask}>
                                Close
                            </button>
                        </div>
                        <div className="col-md-4 d-flex justify-content-center">
                            <button className="btn btn-outline-light m-2" type="button" onClick={updateTask}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default TaskDetail;
