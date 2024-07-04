import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import API_ENDPOINTS from '../../ApiEndpoints/apiConfig';
import { useAuth } from '../../Account/AuthContext/authContext';

const AddNewPhraseModal = ({ show, onClose, onAdd, refreshHistory }) => {
    const [newPhrase, setNewPhrase] = useState('');
    const { authState } = useAuth();
    const user = authState.user;

    const handleAdd = async () => {
        try {
            const { data: csrfToken } = await axios.get(API_ENDPOINTS.USER_DATA);

            const response = await axios.post(API_ENDPOINTS.CREATE_PHRASE, {
                phrase: newPhrase,
                owner: user.id
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                }
            });
            onAdd(response.data);
            onClose();
            refreshHistory();
        } catch (error) {
            console.error('Error adding new phrase:', error);
        }
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add New Phrase</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formPhrase">
                        <Form.Label>Phrase</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter new phrase"
                            value={newPhrase}
                            onChange={(e) => setNewPhrase(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Close</Button>
                <Button variant="primary" onClick={handleAdd}>Add</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddNewPhraseModal;
