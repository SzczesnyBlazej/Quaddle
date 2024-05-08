import React, { useState, useEffect } from 'react';

const UpdateOptionForm = ({ handleUpdateOption, groupName, initialOption, closeUpdateForm }) => {
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
                    <label htmlFor="name" className="form-label">
                        Name:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={updatedOption.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="value" className="form-label">
                        Value:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="value"
                        name="value"
                        value={updatedOption.value}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                        Name:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={updatedOption.name}
                        onChange={handleChange}

                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="advice" className="form-label">
                        Advice:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="advice"
                        name="advice"
                        value={updatedOption.advice}
                        onChange={handleChange}

                    />
                </div>
                <div className="mb-3 form-check">
                    <input
                        type="checkbox"
                        className="form-check-input bg-transparent border border-white"
                        id="active"
                        name="active"
                        checked={updatedOption.active}
                        onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="active">
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

export default UpdateOptionForm;
