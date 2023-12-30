import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AllowOnlyRole from '../Account/AuthContext/AllowOnlyRole';
import { CountTaskToMenuTaskList } from './Functions/CountTaskToMenuTaskList';
import { useAuth } from '../Account/AuthContext/authContext';

function MenuTaskList() {
    const { user } = useAuth();

    const [mytasks, setmytasks] = useState(0);
    const [myAssignedTasks, setmyAssignedTasks] = useState(0);
    const [myClosedTasks, setmyClosedTasks] = useState(0);

    const [allOpenedTask, setallOpenedTask] = useState(0);
    const [allClosedTask, setallClosedTask] = useState(0);
    const [allUnallocated, setallUnallocated] = useState(0);
    const [AllInPendendTask, setAllInPendendTask] = useState(0);
    const [Favorities, setFavorities] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setmytasks(await CountTaskToMenuTaskList("MyTasks", user.id, user.name));
                setmyAssignedTasks(await CountTaskToMenuTaskList("myAssignedTasks", user.id, user.name));
                setallOpenedTask(await CountTaskToMenuTaskList("allOpenedTask", user.id, user.name));
                setmyClosedTasks(await CountTaskToMenuTaskList("myClosedTasks", user.id, user.name));
                setallUnallocated(await CountTaskToMenuTaskList("allUnallocated", user.id, user.name));
                setallClosedTask(await CountTaskToMenuTaskList("allClosedTask", user.id, user.name));
                setAllInPendendTask(await CountTaskToMenuTaskList("AllInPendendTask", user.id, user.name));
                setFavorities(await CountTaskToMenuTaskList("Favorities", user.id, user.name));
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [user.id, user.name]);

    const menuChild = "/Overviews";
    const menu = {
        mytasks: ['/mytasks', 'My Tasks', false, mytasks],
        myAllClosedTasks: ['/myClosedTasks', 'My Closed Task', false, myClosedTasks],
        myAssignedTasks: ['/myAssignedTasks', 'My Assigned Tasks', true, myAssignedTasks],
        allOpenedTasks: ['/allOpenedTask', 'All Opened Task', true, allOpenedTask],
        allClosedTask: ['/allClosedTask', 'All Closed Task', true, allClosedTask],
        allUnallocated: ['/allUnallocated', 'All Unallocated', true, allUnallocated],
        allInPendendTask: ['/AllInPendendTask', 'All In Pendend Task', true, AllInPendendTask],
        favorites: ['/Favorities', 'Favorities', false, Favorities],
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
