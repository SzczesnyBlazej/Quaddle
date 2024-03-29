import React, { useState, useEffect } from 'react';

const UpdateApplicationConfig = ({ handleUpdateOption, groupName, initialOption, closeUpdateForm }) => {
    const [updatedOption, setUpdatedOption] = useState(initialOption);

    useEffect(() => {
        setUpdatedOption(initialOption);
    }, [initialOption]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUpdatedOption((prevOption) => ({
            ...prevOption,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleUpdateOption(updatedOption);
        closeUpdateForm();
    };

    return (
        <div className='m-3'>
            <h3 className="d-flex justify-content-between align-items-center">
                Update Option in "{groupName}"
                <button
                    type="button"
                    className="btn btn-outline-light"
                    onClick={closeUpdateForm}
                >
                    X
                </button>
            </h3>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                        Title:
                    </label>
                    <input
                        type='text'
                        className="form-control"
                        id="title"
                        name="title"
                        value={updatedOption.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                        Description:
                    </label>
                    <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        value={updatedOption.description}
                        onChange={handleChange}
                        rows="2"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="value" className="form-label">
                        Value:
                    </label>
                    <input
                        type="number"
                        className="form-control"
                        id="value"
                        name="value"
                        value={updatedOption.value}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3 form-check">
                    <input
                        type="checkbox"
                        className="form-check-input bg-transparent border border-white"
                        id="enable"
                        name="enable"
                        checked={updatedOption.enable}
                        onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="enable">
                        Active
                    </label>
                </div>
                <button type="submit" className="btn btn-outline-light">
                    Update Option
                </button>
            </form>
        </div>
    );
};

export default UpdateApplicationConfig;
