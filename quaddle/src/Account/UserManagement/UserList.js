// UserList.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

const UserList = ({
    searchTerm,
    handleSearch,
    suggestions,
    handleUpdate,
    handleDelete,
}) => {
    const filterUsersByType = (type) => {
        return suggestions.filter(user => user[type]);
    }

    const adminUsers = filterUsersByType('is_admin');
    const solverUsers = filterUsersByType('is_solver');
    const otherUsers = suggestions.filter(user => !user.is_admin && !user.is_solver);

    return (
        <div className="p-3 col-md-6 text-light dark-bg min-vh-100 border-start border-secondary overflow-auto" style={{ maxHeight: '100vh' }}>
            <h2>User Management</h2>
            <div className="mb-3">
                <label htmlFor="searchInput" className="form-label">
                    Search:
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="searchInput"
                    placeholder='Name, Surname, or Login'
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>
            {adminUsers.length > 0 && (
                <div>
                    <h4 className='light-bg p-2 m-1 rounded'>Admins:</h4>
                    <ul className="list-group">
                        {adminUsers.map((user) => (
                            <li key={user.id} className="p-2 d-flex justify-content-between align-items-center ">
                                <div>
                                    <FontAwesomeIcon icon={faCircle} style={{ color: user.logo_color }} className='pe-2' />
                                    {user.first_name} {user.last_name} ({user.username}) {!user.is_active ? <FontAwesomeIcon icon={faTriangleExclamation} style={{ color: '#ffcc00' }} className='pe-2' /> : ''}
                                </div>
                                <div>
                                    <button className="btn btn-outline-light ms-2" onClick={() => handleUpdate(user.id)}>Update</button>
                                    <button className="btn btn-outline-light ms-2" onClick={() => handleDelete(user.id)}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {solverUsers.length > 0 && (
                <div>
                    <h4 className='light-bg p-2 m-1 rounded'>Solvers:</h4>
                    <ul className="list-group">
                        {solverUsers.map((user) => (
                            <li key={user.id} className="p-2 d-flex justify-content-between align-items-center">
                                <div>
                                    <FontAwesomeIcon icon={faCircle} style={{ color: user.logo_color }} className='pe-2' />
                                    {user.first_name} {user.last_name} ({user.username}) {!user.is_active ? <FontAwesomeIcon icon={faTriangleExclamation} style={{ color: '#ffcc00' }} className='pe-2' /> : ''}
                                </div>
                                <div>
                                    <button className="btn btn-outline-light ms-2" onClick={() => handleUpdate(user.id)}>Update</button>
                                    <button className="btn btn-outline-light ms-2" onClick={() => handleDelete(user.id)}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {otherUsers.length > 0 && (
                <div>
                    <h4 className='light-bg p-2 m-1 rounded'>Others:</h4>
                    <ul className="list-group">
                        {otherUsers.map((user) => (
                            <li key={user.id} className="p-2 d-flex justify-content-between align-items-center">
                                <div>
                                    <FontAwesomeIcon icon={faCircle} style={{ color: user.logo_color }} className='pe-2' />
                                    {user.first_name} {user.last_name} ({user.username}) {!user.is_active ? <FontAwesomeIcon icon={faTriangleExclamation} style={{ color: '#ffcc00' }} className='pe-2' /> : ''}
                                </div>
                                <div>
                                    <button className="btn btn-outline-light ms-2" onClick={() => handleUpdate(user.id)}>Update</button>
                                    <button className="btn btn-outline-light ms-2" onClick={() => handleDelete(user.id)}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UserList;
