import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getCurrentDateFormatted, getCurrentTimeFormatted, sendNotification } from './Functions';
import { useNotification } from '../Functions/NotificationContext';
import API_ENDPOINTS from '../ApiEndpoints/apiConfig';
import { useAuth } from '../Account/AuthContext/authContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { checkIsTaskFavorite, toggleTaskFavorite } from './FavoriteService';
import AllowOnlyRole from '../Account/AuthContext/AllowOnlyRole';
import getSolverList from '../Account/UserManagement/getSolverList';
import getOptions from '../Config/getOptions';

const TaskDetail = ({ task }) => {
    const showNotification = useNotification();
    const { authState } = useAuth();
    const user = authState.user;
    const [isTaskFavorite, setIsTaskFavorite] = useState(false);
    const [isAdmin, setIsAdmin] = useState('');
    const [isSolver, setisSolver] = useState('');
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const list = await getSolverList();
                setSolverList(list);
                const priorityList = await getOptions('Priority');
                setPriorityOptions(priorityList);
                const difficultyList = await getOptions('Difficulty');
                setDifficultyOptions(difficultyList);
                const statusList = await getOptions('Status');
                setStatusOptions(statusList);
                const unitList = await getOptions('Unit');
                setUnitsOptions(unitList);

                const adminStatus = user && user.is_admin;
                const solverStatus = user && user.is_solver;
                setisSolver(solverStatus);
                setIsAdmin(adminStatus);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
        setSelectedSolver(task?.solver || '');
        setSelectedPriority(task?.priority || '');
        setSelectedStatus(task?.status || '');
        setSelectedDifficulty(task?.difficulty || '');
        setSelectedUnit(task?.unit || '');
        setSelectedPhoneNumber(task?.client_fk.phone || '');
        if (task && user) {

            checkIsTaskFavorite(user?.id, task?.id).then((result) => setIsTaskFavorite(result));
        }

    }, [task, user]);

    const handleInputChange = (e, setterFunction) => {
        setterFunction(e.target.value);
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

            await axios.put(
                `${API_ENDPOINTS.UPDATE_TASK}/${task?.id}`,
                acceptTaskData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken,
                    },
                }
            );
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
            sendNotification('Updated post', task?.id);

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
        } catch (error) {
            showNotification('Error updating task:', error.message);
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
            sendNotification('Closed post', task?.id, user.id);
            const { data: csrfToken } = await axios.get(API_ENDPOINTS.USER_DATA);

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
        } catch (error) {
            showNotification('Error updating task:', error.message);
        }

    };

    const handleToggleFavorite = async () => {
        try {
            const success = await toggleTaskFavorite(user, task, isTaskFavorite, setIsTaskFavorite);
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
                    <div className="row ">
                        <div className="col-md-4 d-flex justify-content-center">
                            <AllowOnlyRole roles={["admin", "solver"]}>
                                <button className="btn btn-outline-light m-2" onClick={acceptTask}>
                                    Accept
                                </button>
                            </AllowOnlyRole>
                        </div>
                        <div className="col-md-4 d-flex justify-content-center">
                            <button className="btn btn-outline-light m-2" onClick={closeTask}>
                                Close
                            </button>
                        </div>
                        <div className="col-md-4 d-flex justify-content-center">
                            <button className="btn btn-outline-light m-2" onClick={updateTask}>
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
