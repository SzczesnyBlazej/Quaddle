// EditUserForm.js
import React from 'react';

const EditUserForm = ({
    showEditForm,
    editingUser,
    isAdmin,
    newPassword,
    confirmPassword,
    handleEditFormChange,
    handleEditFormSubmit,
}) => {
    return (
        <div className="p-3 col-md-4 text-light dark-bg min-vh-100 border-start border-secondary">
            {showEditForm && editingUser && (
                <div className="col-md-12">
                    <form onSubmit={handleEditFormSubmit}>
                        <h4 className='p-3'>Personal data</h4>
                        <div className='row'>
                            <div className="mb-3 col-md-4">
                                <label htmlFor="editName" className="form-label">
                                    Name:
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="editName"
                                    name="name"
                                    value={editingUser.name}
                                    onChange={handleEditFormChange}
                                />
                            </div>
                            <div className="mb-3 col-md-4">
                                <label htmlFor="editSurname" className="form-label">
                                    Surname:
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="editSurname"
                                    name="surname"
                                    value={editingUser.surname}
                                    onChange={handleEditFormChange}
                                />
                            </div>
                            <div className="mb-3 col-md-4">
                                <label htmlFor="editUsername" className="form-label">
                                    Username:
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="editUsername"
                                    name="username"
                                    value={editingUser.username}
                                    onChange={handleEditFormChange}
                                />
                            </div>
                        </div>
                        <div className='row'>
                            <h4 className='p-3'>Role</h4>
                            <div className='col-md-3'>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="editIsAdmin"
                                        name="isAdmin"
                                        checked={isAdmin}
                                        onChange={handleEditFormChange}
                                    />
                                    <label className="form-check-label" htmlFor="editIsAdmin">
                                        Admin
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <h4 className='p-3'>Password</h4>
                            <div className="mb-3 col-md-4">
                                <label htmlFor="newPassword" className="form-label">
                                    New Password:
                                </label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="newPassword"
                                    name="newPassword"
                                    value={newPassword}
                                    onChange={handleEditFormChange}
                                />
                            </div>
                            <div className="mb-3 col-md-4">
                                <label htmlFor="confirmPassword" className="form-label">
                                    Confirm Password:
                                </label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={handleEditFormChange}
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-outline-light mt-3">
                            Save Changes
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default EditUserForm;
