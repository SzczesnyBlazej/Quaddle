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
                        <div className='row'>
                            <h4 className='p-3'>Personal data of user ID:{editingUser.id}</h4>
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
                            <div className="mb-3 col-md-4">
                                <label htmlFor="editUserEmail" className="form-label">
                                    Email:
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="editUserEmail"
                                    name="email"
                                    value={editingUser.email}
                                    onChange={handleEditFormChange}
                                />
                            </div>
                            <div className="mb-3 col-md-4">
                                <label htmlFor="editUserPhone" className="form-label">
                                    Phone:
                                </label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    id="editUserPhone"
                                    name="phone"
                                    value={editingUser.phone}
                                    onChange={handleEditFormChange}
                                />
                            </div>
                        </div>
                        <div className='row'>
                            <h4 className='p-3'>Design</h4>
                            <div className="mb-3 col-md-3">
                                <label htmlFor="editLogoColor" className="form-label">
                                    Logo Color:
                                </label>
                                <input
                                    type="color"
                                    className="form-control form-control-color"
                                    id="editLogoColor"
                                    name="logoColor"
                                    value={editingUser.logoColor}
                                    onChange={handleEditFormChange}
                                />
                            </div>

                        </div>
                        <div className='row'>
                            <h4 className='p-3'>Role</h4>
                            <div className='col-md-3'>
                                <div className="form-check">
                                    <input
                                        className="form-check-input bg-transparent border border-white"
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
