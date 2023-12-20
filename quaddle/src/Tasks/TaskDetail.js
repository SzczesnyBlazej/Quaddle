import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getCurrentDateFormatted, getCurrentTimeFormatted, sendNotification } from './Functions'
import { useNotification } from '../Functions/NotificationContext';
import { TaskStatusEnum } from '../Enums/TaskStatusEnum';
import { SolverEnum } from '../Enums/SolverEnum';
import { PriorityEnum } from '../Enums/PriorityEnum';
import { DifficultyEnum } from '../Enums/DifficultyEnum';
import { UnitEnum } from '../Enums/UnitEnum';
import API_ENDPOINTS from '../ApiEndpoints/apiConfig';
import { useAuth } from '../Account/AuthContext/authContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { checkIsTaskFavorite, toggleTaskFavorite } from './FavoriteService';

const TaskDetail = ({ task }) => {
    const showNotification = useNotification();

    const [selectedSolver, setSelectedSolver] = useState('');
    const [selectedPriority, setSelectedPriority] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('');
    const [selectedUnit, setSelectedUnit] = useState('');
    const [selectedPhoneNumber, setSelectedPhoneNumber] = useState('');
    const { user } = useAuth();
    const [isTaskFavorite, setIsTaskFavorite] = useState(false);

    useEffect(() => {
        setSelectedSolver(task?.solver || '');
        setSelectedPriority(task?.priority || '');
        setSelectedStatus(task?.status || '');
        setSelectedDifficulty(task?.difficulty || '');
        setSelectedUnit(task?.unit || '');
        setSelectedPhoneNumber(task?.contactNumber || '');
        checkIsTaskFavorite(user?.id, task?.id).then((result) => setIsTaskFavorite(result));
    }, [task, user]);

    const handleInputChange = (e, setterFunction) => {
        setterFunction(e.target.value);
    };

    const dropdownOptions = (options) => (
        <>
            <option value="">---</option>
            {options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </>
    );

    const updateTask = async () => {
        try {
            const updatedTask = {
                ...task,
                solver: selectedSolver,
                priority: selectedPriority,
                status: selectedStatus,
                difficulty: selectedDifficulty,
                unit: selectedUnit,
                contactNumber: selectedPhoneNumber,
                lastModificationHour: getCurrentTimeFormatted(),
                lastModification: getCurrentDateFormatted(),
            };

            await axios.put(API_ENDPOINTS.TASKS + `/${task?.id}`, updatedTask);
            sendNotification("updated post ", task?.id);
        } catch (error) {
            showNotification('Błąd podczas aktualizacji zadania:', error.message);
        }
    };

    const closeTask = async () => {
        const userString = localStorage.getItem('user');
        const user = userString ? JSON.parse(userString) : null;

        if (user && user.name) {
            try {
                const updatedTask = {
                    ...task,
                    priority: selectedPriority,
                    difficulty: selectedDifficulty,
                    unit: selectedUnit,
                    contactNumber: selectedPhoneNumber,
                    lastModificationHour: getCurrentTimeFormatted(),
                    lastModification: getCurrentDateFormatted(),
                    solver: user.name,
                    status: "Close",
                    closeDate: getCurrentDateFormatted(),
                    closeHour: getCurrentTimeFormatted(),
                };

                await axios.put(API_ENDPOINTS.TASKS + `/${task?.id}`, updatedTask);
                sendNotification("closed post", task?.id);
            } catch (error) {
                showNotification('Błąd podczas aktualizacji zadania:', error.message);
            }
        } else {
            showNotification('User information not found in local storage.');
        }
    };

    const handleToggleFavorite = () => {
        toggleTaskFavorite(user, task, isTaskFavorite, setIsTaskFavorite);
    };

    return (
        <div className="col-md-2 light-bg min-vh-100 d-flex flex-column position-relative overflow-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
            <form>
                <div className="container text-light">
                    <div className="d-flex align-items-center justify-content-between p-2">
                        <h2 className='mb-0'>Task</h2>
                        <FontAwesomeIcon
                            icon={isTaskFavorite ? faStar : faStarRegular}
                            style={{ color: isTaskFavorite ? 'gold' : 'inherit', cursor: 'pointer' }}
                            size="xl"
                            title={isTaskFavorite ? 'Click to remove from favorites' : 'Click to add to favorites'}
                            onClick={handleToggleFavorite}
                        />
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
                        >
                            {dropdownOptions(Object.values(SolverEnum))}
                        </select>
                    </div>

                    <div className="form-group p-1">
                        <label htmlFor="createDateTimeInput">Create Date and Time</label>
                        <div className="d-flex">
                            <input
                                type="text"
                                className="form-control me-2"
                                id="createDateInput"
                                value={task?.createDate || getCurrentDateFormatted()} // Use the task's createDate or the current date
                                readOnly
                            />
                            <input
                                type="text"
                                className="form-control"
                                id="createHourInput"
                                value={task?.createHour || ''}
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
                                value={task?.lastModification || ''}
                                readOnly
                            />
                            <input
                                type="text"
                                className="form-control"
                                id="lastModificationHourInput"
                                value={task?.lastModificationHour || ''}
                                readOnly
                            />
                        </div>
                    </div>

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
                            {dropdownOptions(Object.values(PriorityEnum))}

                        </select>
                    </div>

                    <div className="form-group p-1">
                        <label htmlFor="statusInput">Status</label>
                        <select
                            className="form-control form-select"
                            id="statusInput"
                            aria-describedby="emailHelp"
                            value={selectedStatus}
                            onChange={(e) => handleInputChange(e, setSelectedStatus)}
                            aria-label="Status"
                        >
                            {dropdownOptions(Object.values(TaskStatusEnum))}
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
                            {dropdownOptions(Object.values(DifficultyEnum))}

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
                            {dropdownOptions(Object.values(UnitEnum))}

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
                        >
                        </input>
                    </div>

                </div>
                <div className="text-light mt-auto position-absolute bottom-0 w-100">
                    <hr className="border-secondary" />
                    <div className='row w-100'>
                        <div className='col-md-4'>

                        </div>
                        <div className='col-md-4'>
                            <button className="btn btn-outline-light m-3" onClick={closeTask}>Zamknij</button>

                        </div>
                        <div className='col-md-4'>

                            <button className="btn btn-outline-light m-3" onClick={updateTask}>Zapisz</button>
                        </div>
                    </div>
                </div>


            </form>
        </div>
    );
};

export default TaskDetail;
