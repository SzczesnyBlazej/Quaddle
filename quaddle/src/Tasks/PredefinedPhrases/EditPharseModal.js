import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import API_ENDPOINTS from '../../ApiEndpoints/apiConfig';
import Cookies from 'js-cookie';

const EditPhraseModal = ({ show, onClose, phrase, onEdit }) => {
    const [editedPhrase, setEditedPhrase] = useState(phrase.phrase);

    const handleEdit = async () => {
        try {
            const accessToken = Cookies.get('access_token');

            const response = await axios.patch(
                `${API_ENDPOINTS.EDIT_PHRASES}/${phrase.id}`,
                { phrase: editedPhrase },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }

            );

            onEdit(response.data);
            onClose();
        } catch (error) {
            console.error('Error editing phrase:', error);
        }
    };

    useEffect(() => {
        setEditedPhrase(phrase.phrase);
    }, [phrase]);

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Phrase</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formPhrase">
                        <Form.Label>Phrase</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}

                            placeholder="Edit phrase"
                            value={editedPhrase}
                            onChange={(e) => setEditedPhrase(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Close</Button>
                <Button variant="primary" onClick={handleEdit}>Save Changes</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditPhraseModal;
