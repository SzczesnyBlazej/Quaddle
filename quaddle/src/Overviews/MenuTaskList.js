import React from 'react'
import { Link } from 'react-router-dom';

function MenuTaskList() {
    const menuChild = "/Overviews";
    const menu = {
        mytasks: ['/mytasks', 'My Tasks'],
        allOpenedTasks: ['/allOpenedTask', 'All Opened Task',],
        myAllClosedTasks: ['/myAllClosedTasks', 'My All Closed Task',],
        allUnallocated: ['/allUnallocated', 'All Unallocated',],

    };
    return (
        <div className="col-md-2 dark-bg min-vh-100 d-flex flex-column position-relative border-start border-secondary">
            <h2 className='text-light p-2'>Select tasks</h2>
            {Object.entries(menu).map(([key, value]) => (
                <React.Fragment key={key}>
                    <Link to={menuChild + value[0]} className="nav-link">
                        <div className='d-flex align-items-center text-light'>

                            <div className='col-md-10 m-2'>
                                {value[1]}
                            </div>
                        </div>
                    </Link>
                    <hr className="border-secondary m-2" />
                </React.Fragment>
            ))}
        </div>
    )
}

export default MenuTaskList