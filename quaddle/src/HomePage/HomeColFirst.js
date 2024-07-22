import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGaugeHigh, faListUl, faMagnifyingGlass, faCircleDot, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
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

const renderSuggestion = (suggestion) => (
    <div>
        <strong>{suggestion.title}</strong>
    </div>
);

function HomeColFirst({ isLoading = false }) {
    const showNotification = useNotification();
    const [value, setValue] = useState(sessionStorage.getItem('searchValue') || '');
    const [suggestions, setSuggestions] = useState(
        JSON.parse(localStorage.getItem('suggestions')) || []
    );
    const { authState } = useAuth();
    const user = authState.user;
    const menu = {
        home: ['/', 'Dashboard', faGaugeHigh],
        overviews: ['/Overviews/mytasks', 'Overviews', faListUl],
        notification: ['#', 'Notifications', faPaperPlane],
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
                    />
                    <span className="input-group-text border-0" id="search-addon">
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </span>
                </div>
            </div>
            <hr className="border-secondary m-2" />
            <div className="nav flex-column">
                {Object.entries(menu).map(([key, value]) => (
                    <React.Fragment key={key}>
                        <Link to={value[0]} className="nav-link">
                            <div className='d-flex align-items-center text-light'>
                                <div className='col-md-2 text-center'>
                                    {key === 'notification' ? (
                                        <NotificationsDropdown />
                                    ) : (
                                        <FontAwesomeIcon icon={value[2]} size="xl" />
                                    )}
                                </div>
                                <div className='col-md-10'>
                                    {value[1]}
                                </div>
                            </div>
                        </Link>
                        <hr className="border-secondary m-2" />
                    </React.Fragment>
                ))}
                <div style={{ overflowY: 'auto', maxHeight: '27vh' }}>
                    {isLoading ? <Box >
                        <CircularProgress />
                    </Box> : <ShowLastViewedTasks />
                    }
                </div>
                {suggestions.length > 0 ? <strong className='text-white text-center pb-2'>Results search</strong> : ''}
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
        </div>
    );
}

export default HomeColFirst;
