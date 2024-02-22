import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AllowOnlyRole from '../Account/AuthContext/AllowOnlyRole';
import { useAuth } from '../Account/AuthContext/authContext';
import API_ENDPOINTS from '../ApiEndpoints/apiConfig';
import axios from 'axios';

function MenuTaskList() {
    const { authState } = useAuth();
    const user = authState.user;
    const [counterList, setCounterList] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(API_ENDPOINTS.COUNT_ALL_TASKS_TO_MENU, {
                    params: {
                        userID: user && user.id
                    }
                });
                setCounterList(response.data);
            } catch (error) {
                console.log('Error fetching tasks:', error);
            }
        };

        fetchData();
    }, [user]);

    const menuChild = "/Overviews";
    const menu = {
        mytasks: ['/mytasks', 'My Tasks', false, counterList.MyTasks],
        myClosedTasks: ['/myClosedTasks', 'My Closed Task', false, counterList.myClosedTasks],
        myAssignedTasks: ['/myAssignedTasks', 'My Assigned Tasks', true, counterList.myAssignedTasks],
        allOpenedTasks: ['/allOpenedTask', 'All Opened Task', true, counterList.allOpenedTask],
        allClosedTask: ['/allClosedTask', 'All Closed Task', true, counterList.allClosedTask],
        allUnallocated: ['/allUnallocated', 'All Unallocated', true, counterList.allUnallocated],
        allInPendendTask: ['/AllInPendendTask', 'All In Pendend Task', true, counterList.AllInPendendTask],
        favorites: ['/Favorities', 'Favorities', false, counterList.favorites],
    };

    return (
        <div className="col-md-2 dark-bg min-vh-100 d-flex flex-column position-relative border-start border-secondary">
            <h2 className='text-light p-2'>Select tasks</h2>
            {Object.entries(menu).map(([key, value]) => (
                <React.Fragment key={key}>
                    {value[2] && (
                        <AllowOnlyRole roles={["admin", "solver"]}>
                            <Link to={menuChild + value[0]} className="nav-link">
                                <div className='d-flex align-items-center text-light'>
                                    <div className='col-md-10 ps-3 p-2'>
                                        {value[1]}
                                    </div>
                                    <div className="col-md-2"><strong>{value[3]}</strong></div>
                                </div>
                                <hr className="border-secondary m-2" />
                            </Link>
                        </AllowOnlyRole>
                    )}
                    {!value[2] && (
                        <Link to={menuChild + value[0]} className="nav-link">
                            <div className='d-flex align-items-center text-light'>
                                <div className='col-md-10 ps-3 p-2'>
                                    {value[1]}
                                </div>
                                <div className="col-md-2"><strong>{value[3]}</strong></div>
                            </div>

                            <hr className="border-secondary m-2" />
                        </Link>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}

export default MenuTaskList;
