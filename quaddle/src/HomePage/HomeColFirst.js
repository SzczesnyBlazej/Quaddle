import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGaugeHigh, faListUl, faPlus, faQuestion, faMagnifyingGlass, faCircleDot, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import './home.css';
import { useAuth } from '../Account/AuthContext/authContext';
import LogoTemplate from './LogoTemplate';
import axios from 'axios';
import { useNotification } from '../Functions/NotificationContext';
import API_ENDPOINTS from '../ApiEndpoints/apiConfig';
import logo from '../LOGO.png';
import ShowLastViewedTasks from '../Overviews/ShowLastViewedTasks';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import NotificationsDropdown from './NotificationsDropdown';
import NewTask from '../Tasks/NewTask';
import HelpModal from '../Tasks/HelpModal';
import SessionTimer from '../Account/AuthContext/SessionTimer';
import { IconButton, Badge } from '@mui/material';

function HomeColFirst({ isLoading = false }) {
    const showNotification = useNotification();
    const [showNewTask, setShowNewTask] = useState(false);
    const [showHelp, setHelp] = useState(false);
    const [openNotifications, setOpenNotifications] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const anchorRef = useRef(null);

    const [value, setValue] = useState(sessionStorage.getItem('searchValue') || '');
    const [suggestions, setSuggestions] = useState(
        JSON.parse(localStorage.getItem('suggestions')) || []
    );
    const { authState } = useAuth();
    const user = authState.user;
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const menu = {
        home: ['/', 'Dashboard', faGaugeHigh],
        overviews: ['/Overviews/mytasks', 'Overviews', faListUl],
        notification: ['#', 'Notifications', faPaperPlane],
    };

    const handleNewTaskButtonClick = () => {
        setShowNewTask(true);
    };

    const handleShowHelpButtonClick = () => {
        setHelp(true);
    };

    const handleToggleNotifications = () => {
        setOpenNotifications((prevOpen) => !prevOpen);
    };

    const handleCloseNotifications = () => {
        setOpenNotifications(false);
    };

    const fetchSuggestions = async (inputValue) => {
        try {
            const response = await axios.get(API_ENDPOINTS.TASK_API, {
                params: {
                    q: inputValue,
                    ...(!user.is_admin && { client_id: user.id }),
                },
            });

            setSuggestions(response.data);
            localStorage.setItem('suggestions', JSON.stringify(response.data));
            return response.data;
        } catch (error) {
            showNotification('Error fetching suggestions:', error.message);
            return [];
        }
    };

    const onChange = async (event) => {
        const newValue = event.target.value;
        setValue(newValue);

        if (newValue.trim().length <= 2) {
            sessionStorage.removeItem('searchValue');
            localStorage.removeItem('suggestions');
            setSuggestions([]);
        } else {
            sessionStorage.setItem('searchValue', newValue);
            await fetchSuggestions(newValue);
        }
    };

    return (
        <div className="col-md-2 dark-bg min-vh-100 d-flex flex-column position-relative">
            <Link to="/" className="text-decoration-none d-flex align-items-center">
                <div className='row position-relative'>
                    <div className='col-md-4 d-flex flex-column align-items-center justify-content-center text-center'>
                        <img src={logo} alt="Quaddle Logo" className="img-fluid position-relative ms-3" />
                    </div>
                    <div className='col-md-8 d-flex flex-column align-items-center justify-content-center text-center'>
                        <h2 className='text-light position-relative'>Quaddle</h2>
                    </div>
                </div>
            </Link>
            <div className="input-group rounded ps-3 pe-3 pt-2">
                <div className="input-group rounded ps-3 pe-3">
                    <input
                        type="search"
                        className="form-control"
                        placeholder="Search"
                        aria-label="Search"
                        aria-describedby="search-addon"
                        value={value}
                        onChange={onChange}
                        ref={inputRef}
                    />
                    <span className="input-group-text border-0" id="search-addon">
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </span>
                </div>
            </div>
            <hr className="border-secondary m-2" />
            <div className="nav flex-column">
                {Object.entries(menu).map(([key, [path, label, icon]]) => (
                    <React.Fragment key={key}>
                        {key === 'notification' ? (
                            <div className="nav-link" onClick={handleToggleNotifications} ref={anchorRef}>
                                <div className='d-flex align-items-center text-light'>
                                    <div className='col-md-2 text-center'>
                                        <Badge badgeContent={notificationCount} color="secondary">
                                            <FontAwesomeIcon icon={icon} size="xl" />
                                        </Badge>
                                    </div>
                                    <div className='col-md-10'>
                                        {label}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link to={path} className="nav-link">
                                <div className='d-flex align-items-center text-light'>
                                    <div className='col-md-2 text-center'>
                                        <FontAwesomeIcon icon={icon} size="xl" />
                                    </div>
                                    <div className='col-md-10'>
                                        {label}
                                    </div>
                                </div>
                            </Link>
                        )}
                        <hr className="border-secondary m-2" />
                    </React.Fragment>
                ))}
                <div style={{ overflowY: 'auto', maxHeight: '27vh' }}>
                    {isLoading ? (
                        <Box>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <ShowLastViewedTasks />
                    )}
                </div>
                {suggestions.length > 0 ? (
                    <strong className='text-white text-center pb-2'>Results search</strong>
                ) : (
                    ''
                )}
                <div style={{ overflowY: 'auto', maxHeight: '27vh' }}>
                    {suggestions.map((suggestion) => (
                        <React.Fragment key={suggestion.id}>
                            <Link to={"/tasks/" + suggestion?.id} className="nav-link">
                                <div className='d-flex align-items-center text-light'>
                                    <div className='col-md-2 text-center'>
                                        <FontAwesomeIcon
                                            icon={faCircleDot}
                                            style={{
                                                color: suggestion.status_fk?.value === 'Open' ? 'orange' : suggestion.status_fk?.value === 'Close' ? '#00a347' : 'gray'
                                            }}
                                        />
                                    </div>
                                    <div className='col-md-10'>
                                        {suggestion.title}
                                    </div>
                                </div>
                            </Link>
                            <hr className="border-secondary m-2" />
                        </React.Fragment>
                    ))}
                </div>
            </div>
            <div className="text-light mt-auto position-absolute bottom-0 w-100">
                <span className='ps-2'><SessionTimer /></span>
                <hr className="border-secondary" />
                <div className='row text-center mb-3'>
                    <div className='col-md-4'>
                        {LogoTemplate(user)}
                    </div>
                    <div className='col-md-4'>
                        <button
                            type="button"
                            className="btn dropdown-toggle rounded-circle dropdown-toggle-no-arrow border-0"
                            onClick={handleNewTaskButtonClick}
                        >
                            <div className="btn btn-outline-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                                <span><FontAwesomeIcon icon={faPlus} size="2xl" /></span>
                            </div>
                        </button>
                        {showNewTask && <NewTask onClose={() => setShowNewTask(false)} />}
                    </div>
                    <div className='col-md-4'>
                        <button
                            type="button"
                            className="btn rounded-circle border-0"
                            onClick={handleShowHelpButtonClick}
                        >
                            <div className="btn btn-outline-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                                <span><FontAwesomeIcon icon={faQuestion} size="2xl" /></span>
                            </div>
                        </button>
                        {showHelp && <HelpModal onClose={() => setHelp(false)} />}
                    </div>
                </div>
            </div>

            <NotificationsDropdown
                open={openNotifications}
                handleClose={handleCloseNotifications}
                anchorRef={anchorRef}
                onNotificationCountChange={setNotificationCount}
            />
        </div>
    );
}

export default HomeColFirst;
