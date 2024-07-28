import React, { useState } from 'react';

const AddOptionForm = ({ handleAddNewOptionSubmit, groupName, closeAddOptionForm }) => {
    const [newOption, setNewOption] = useState({
        title: groupName,
        value: '',
        name: groupName,
        active: true,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewOption((prevOption) => ({
            ...prevOption,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleAddNewOptionSubmit(newOption, groupName);
        setNewOption({
            title: groupName,
            name: groupName,
            value: '',
            active: true,
        });
    };

    return (
        <div className='m-3'>
            <h3 className="d-flex justify-content-between align-items-center">
                Add New Option to "{groupName}"
                <button
                    type="button"
                    className="btn btn-outline-light"
                    onClick={closeAddOptionForm}
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
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        value={groupName}
                        onChange={handleChange}
                        readOnly
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
                        value={newOption.value}
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
                        value={newOption.name}
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
                        value={newOption.advice}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3 form-check">
                    <input
                        type="checkbox"
                        className="form-check-input bg-transparent border border-white"
                        id="active"
                        name="active"
                        checked={newOption.active}
                        onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="active">
                        Active
                    </label>
                </div>
                <button type="submit" className="btn btn-outline-light">
                    Add Option
                </button>
            </form>
        </div>
    );
};

export default AddOptionForm;
