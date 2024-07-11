import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import AddNewPhraseModal from './AddNewPhraseModal';
import EditPhraseModal from './EditPharseModal';
import API_ENDPOINTS from '../../ApiEndpoints/apiConfig';
import { Tooltip } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';
const PredefinedPhrasesModal = ({ onClose, onSelectPhrase }) => {
    const [history, setHistory] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedPhrase, setSelectedPhrase] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const accessToken = Cookies.get('access_token');
                const response = await axios.get(API_ENDPOINTS.GET_PHRASES, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setHistory(response.data);
            } catch (error) {
                console.error('Error fetching phrases:', error);
            }
        };
        fetchHistory();
    }, []);

    const handleAdd = (newPhrase) => {
        setHistory([...history, newPhrase]);
    };

    const handleEdit = (updatedPhrase) => {
        setHistory(history.map(phrase => (phrase.id === updatedPhrase.id ? updatedPhrase : phrase)));
    };

    const handleDelete = async (phraseId) => {
        try {
            const accessToken = Cookies.get('access_token');
            await axios.delete(`${API_ENDPOINTS.DELETE_PHRASE}/${phraseId}/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setHistory(history.filter(phrase => phrase.id !== phraseId));
        } catch (error) {
            console.error('Error deleting phrase:', error);
        }
    };

    const refreshHistory = async () => {
        try {
            const accessToken = Cookies.get('access_token');
            const response = await axios.get(API_ENDPOINTS.GET_PHRASES, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setHistory(response.data);
        } catch (error) {
            console.error('Error fetching phrases:', error);
        }
    };

    const formatDate = (dateString) => {
        if (dateString) {
            const date = new Date(dateString);
            return format(date, 'dd-MM-yyyy HH:mm');
        }
        return 'Unable to retrieve date';
    };

    return (
        <>
            <Modal show={true} onHide={onClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Use predefined phrases in your message
                        <Tooltip className="p-1" title="Double-click on the phrase text to add it to the message field" placement="right-start">
                            <FontAwesomeIcon icon={faCircleInfo} />
                        </Tooltip>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TableContainer component={Paper}>
                        <Table className="table table-responsive">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Phrase</TableCell>
                                    <TableCell className="text-end">Create Date</TableCell>
                                    <TableCell className="text-end">Last Edited Date</TableCell>
                                    <TableCell className="text-end">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {history.map((phrase) => (
                                    <TableRow key={phrase.id}>
                                        <TableCell
                                            onDoubleClick={() => { onSelectPhrase(phrase.phrase); }}
                                        >
                                            {phrase.phrase}
                                        </TableCell>
                                        <TableCell className="text-end">{formatDate(phrase.create_date)}</TableCell>
                                        <TableCell className="text-end">{phrase.edited_date ? formatDate(phrase.edited_date) : '---'}</TableCell>
                                        <TableCell className="text-end">
                                            <Tooltip title="Delete" placement="right-start">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-dark btn-sm m-1"
                                                    onClick={() => handleDelete(phrase.id)}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </Tooltip>
                                            <Tooltip title="Edit" placement="right-start">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-dark btn-sm m-1"
                                                    onClick={() => { setSelectedPhrase(phrase); setShowEditModal(true); }}
                                                >
                                                    <FontAwesomeIcon icon={faPenToSquare} />
                                                </button>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-outline-dark m-2" type="button" onClick={() => setShowAddModal(true)}>Add New</button>
                    <button className="btn btn-outline-dark m-2" type="button" onClick={onClose}>Close</button>
                </Modal.Footer>
            </Modal>
            <AddNewPhraseModal show={showAddModal} onClose={() => setShowAddModal(false)} onAdd={handleAdd} refreshHistory={refreshHistory} />
            {selectedPhrase && <EditPhraseModal show={showEditModal} onClose={() => setShowEditModal(false)} phrase={selectedPhrase} onEdit={handleEdit} />}
        </>
    );
};

export default PredefinedPhrasesModal;
