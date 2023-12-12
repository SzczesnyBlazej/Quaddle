// UserList.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faCircle } from '@fortawesome/free-solid-svg-icons';

const UserList = ({
    searchTerm,
    handleSearch,
    suggestions,
    handleUpdate,
    handleDelete,
}) => {
    return (

        <div className="p-3 col-md-6 text-light dark-bg min-vh-100 border-start border-secondary overflow-auto" style={{ maxHeight: '100vh' }}>
            <h2>User Management</h2>
            <div className="mb-3 ">
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
            {suggestions.length > 0 && (
                <ul className="list-group">
                    {suggestions.map((user) => (
                        <div className="row g-2" key={user.id}>
                            <div className="col-md-8 d-flex align-items-center">
                                <li className="nav-link">
                                    <FontAwesomeIcon icon={faCircle} style={{ color: user.logoColor }} className='pe-2' />
                                    {user.name} {user.surname} ({user.username})
                                </li>
                            </div>
                            <div className="col-md-4 d-flex">
                                <button
                                    className="btn btn-outline-light ms-auto ms-2 mb-2"
                                    onClick={() => handleUpdate(user.id)}
                                >
                                    Update
                                </button>
                                <button
                                    className="btn btn-outline-light ms-2 mb-2"
                                    onClick={() => handleDelete(user.id)}
                                >
                                    Delete
                                </button>
                            </div>
                            <hr className="border-secondary" />
                        </div>
                    ))}
                </ul>
            )}

        </div>
    );
};

export default UserList;
