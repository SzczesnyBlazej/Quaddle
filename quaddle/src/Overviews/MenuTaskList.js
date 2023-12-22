import React from 'react'
import { Link } from 'react-router-dom';
import AllowOnlyAdmin from '../Account/AuthContext/AllowOnlyAdmin';

function MenuTaskList() {
    const menuChild = "/Overviews";
    const menu = {
        mytasks: ['/mytasks', 'My Tasks', false],
        myAssignedTasks: ['/myAssignedTasks', 'My Assigned Tasks', true],
        allOpenedTasks: ['/allOpenedTask', 'All Opened Task', true],
        myAllClosedTasks: ['/myClosedTasks', 'My Closed Task', false],
        allUnallocated: ['/allUnallocated', 'All Unallocated', true],
        allInPendendTask: ['/AllInPendendTask', 'All In Pendend Task', true],
        favorites: ['/Favorities', 'Favorities', false],

    };
    return (
        <div className="col-md-2 dark-bg min-vh-100 d-flex flex-column position-relative border-start border-secondary">
            <h2 className='text-light p-2'>Select tasks</h2>
            {Object.entries(menu).map(([key, value]) => (
                <React.Fragment key={key}>
                    {value[2] && (
                        <AllowOnlyAdmin>
                            <Link to={menuChild + value[0]} className="nav-link">
                                <div className='d-flex align-items-center text-light'>
                                    <div className='col-md-10 m-2'>
                                        {value[1]}
                                    </div>
                                </div>
                                <hr className="border-secondary m-2" />
                            </Link>
                        </AllowOnlyAdmin>
                    )}
                    {!value[2] && (
                        <Link to={menuChild + value[0]} className="nav-link">
                            <div className='d-flex align-items-center text-light'>
                                <div className='col-md-10 m-2'>
                                    {value[1]}
                                </div>
                            </div>
                            <hr className="border-secondary m-2" />
                        </Link>

                    )}
                </React.Fragment>
            ))}
        </div>
    )
}

export default MenuTaskList