import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { getCurrentTimeFormatted, getCurrentDateFormatted, sendNotification } from "./Functions"

const NewTask = ({ onClose }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [solver, setSolver] = useState('');
    const [unit, setUnit] = useState('');
    const [closeDate, setCloseDate] = useState('');
    const [closeHour, setCloseHour] = useState('');
    const [contactNumber, setContactNumber] = useState('');

    const [addTaskError, setAddTaskError] = useState('');

    const handleAddTask = async (e) => {
        e.preventDefault();
        try {
            const getStoredUsername = localStorage.getItem('user');

            const getUsers = await axios.get('http://localhost:3500/users');
            const customers = getUsers.data;
            const storedUser = JSON.parse(getStoredUsername);
            const storedUsername = storedUser.username;
            if (storedUsername) {
                const foundUser = customers.find(user => user.username === storedUsername);
                if (foundUser) {

                    const response = await axios.post('http://localhost:3500/tasks', {
                        title,
                        description,
                        clientID: foundUser?.id,
                        createDate: getCurrentDateFormatted(),
                        createHour: getCurrentTimeFormatted(),
                        lastModification: getCurrentDateFormatted(),
                        lastModificationHour: getCurrentTimeFormatted(),
                        closeDate,
                        closeHour,
                        priority: 2,
                        difficulty,
                        solver,
                        status: "Open",
                        unit,
                        contactNumber,


                    });
                    sendNotification("created post ", response.data?.id);

                    onClose();

                } else {
                    setAddTaskError('User not found');
                }
            } else {
                setAddTaskError('No user stored in database');
            }

        } catch (error) {
            setAddTaskError('Error during add task');
        }
    };

    return (
        <Modal show={true} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {addTaskError && (
                    <div className="alert alert-danger" role="alert">
                        {addTaskError}
                    </div>
                )}
                <form onSubmit={handleAddTask}>
                    <div className="form-group">
                        <label htmlFor="title">Title:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="title"
                            placeholder="Enter your title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description:</label>
                        <textarea
                            rows="4"
                            className="form-control"
                            id="description"
                            placeholder="Enter your description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="unit">Unit:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="unit"
                            placeholder="Enter your unit"
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="contactNumber">Contact Number:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="contactNumber"
                            placeholder="Enter your Contact Number"
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                        />
                    </div>

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </form>

            </Modal.Body>
        </Modal>
    );
};

export default NewTask;