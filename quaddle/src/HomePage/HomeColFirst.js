import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGaugeHigh, faListUl, faMagnifyingGlass, faPlus, faCircleDot, faQuestion } from '@fortawesome/free-solid-svg-icons';
import './home.css';
import { useAuth } from '../Account/AuthContext/authContext';
import LogoTemplate from './LogoTemplate';
import NewTask from '../Tasks/NewTask';
import axios from 'axios';
import { useNotification } from '../Functions/NotificationContext';

const renderSuggestion = (suggestion) => (
    <div>
        <strong>{suggestion.title}</strong>
    </div>
);

function HomeColFirst() {
    const showNotification = useNotification();

    const { user } = useAuth();

    const menu = {
        home: ['/', 'Dashboard', faGaugeHigh],
        overviews: ['/Overviews/mytasks', 'Overviews', faListUl],
    };
    const [showNewTask, setShowNewTask] = useState(false);
    const [value, setValue] = useState(sessionStorage.getItem('searchValue') || '');
    const [suggestions, setSuggestions] = useState(
        JSON.parse(localStorage.getItem('suggestions')) || []
    );

    const handleNewTaskButtonClick = () => {
        setShowNewTask(true);
    };

    const fetchSuggestions = async (inputValue) => {

        try {
            const response = await axios.get(`http://localhost:3502/tasks/?q=${inputValue}`);
            const newSuggestions = response.data.map((task) => ({
                title: task.title,
                description: task.description,
                id: task.id,
                status: task.status,
            }));

            setSuggestions(newSuggestions);
            localStorage.setItem('suggestions', JSON.stringify(newSuggestions));
            return newSuggestions;
        } catch (error) {
            showNotification('Error fetching suggestions:', error.message);

            return [];
        }
    };

    const onChange = async (event) => {
        const newValue = event.target.value;
        setValue(newValue);

        if (newValue.trim() === '') {
            sessionStorage.removeItem('searchValue');
            localStorage.removeItem('suggestions');
            setSuggestions([]);
        } else {
            sessionStorage.setItem('searchValue', newValue);
            await fetchSuggestions(newValue);
        }
    };

    useEffect(() => {

    }, [value]);

    return (


        <div className="col-md-2 dark-bg min-vh-100 d-flex flex-column position-relative">

            <h2 className='text-light p-2'>Quaddle</h2>
            <div className="input-group rounded ps-3 pe-3">
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
                                    <FontAwesomeIcon icon={value[2]} size="xl" />
                                </div>
                                <div className='col-md-10'>
                                    {value[1]}
                                </div>
                            </div>
                        </Link>
                        <hr className="border-secondary m-2" />
                    </React.Fragment>
                ))}
                <div style={{ overflowY: 'auto', maxHeight: '60vh' }}>

                    {suggestions.map((suggestion) => (
                        <React.Fragment key={suggestion.id}>
                            <Link to={"/tasks/" + suggestion?.id} className="nav-link">
                                <div className='d-flex align-items-center text-light'>
                                    <div className='col-md-2 text-center'>
                                        <FontAwesomeIcon
                                            icon={faCircleDot}
                                            style={{
                                                color: suggestion.status === 'Open' ? "#00a347" : suggestion.status === 'Close' ? "gray" : "yellow",
                                            }}
                                        />
                                    </div>

                                    <div className='col-md-10'>
                                        <small>{renderSuggestion(suggestion)}</small>
                                    </div>
                                </div>
                            </Link>
                            <hr className="border-secondary m-2" />
                        </React.Fragment>
                    ))}
                </div>
            </div>
            <div className="text-light mt-auto position-absolute bottom-0 w-100">
                <hr className="border-secondary" />
                <div className='row text-center mb-3'>
                    <div className='col-md-4'>
                        {LogoTemplate(user)}
                    </div>
                    <div className='col-md-4'>
                        <button
                            type="button"
                            className="btn dropdown-toggle rounded-circle dropdown-toggle-no-arrow border-0"
                            onClick={handleNewTaskButtonClick}>
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
                        >
                            <div className="btn btn-outline-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                                <span><FontAwesomeIcon icon={faQuestion} size="2xl" /></span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomeColFirst;
