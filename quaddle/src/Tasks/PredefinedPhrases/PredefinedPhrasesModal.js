import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import AddNewPhraseModal from './AddNewPhraseModal';
import EditPhraseModal from './EditPharseModal';
import API_ENDPOINTS from '../../ApiEndpoints/apiConfig';
import { Tooltip } from '@mui/material';

const PredefinedPhrasesModal = ({ onClose }) => {
    const [history, setHistory] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedPhrase, setSelectedPhrase] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axios.get(API_ENDPOINTS.GET_PHRASES);
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

    const refreshHistory = async () => {
        try {
            const response = await axios.get(API_ENDPOINTS.GET_PHRASES);
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
        return '';
    };


    return (
        <>
            <Modal show={true} onHide={onClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        Use predefined phrases in your message
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TableContainer component={Paper}>
                        <Table className="table table-responsive">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Phrase</TableCell>
                                    <TableCell className="text-end">Create Date</TableCell>
                                    <TableCell className="text-end">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {history.map((phrase) => (
                                    <TableRow key={phrase.id}>
                                        <TableCell onClick={() => { setSelectedPhrase(phrase); setShowEditModal(true); }}>{phrase.phrase}</TableCell>
                                        <TableCell className="text-end">{formatDate(phrase.create_date)}</TableCell>
                                        <TableCell className="text-end">
                                            <Tooltip title="Delete" placement="right-start">

                                                <button
                                                    type="button"
                                                    className="btn btn-outline-dark btn-sm"
                                                >

                                                    X
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
