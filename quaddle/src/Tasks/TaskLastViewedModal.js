import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useNotification } from '../Functions/NotificationContext';
import axios from 'axios';
import API_ENDPOINTS from '../ApiEndpoints/apiConfig';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel } from '@mui/material';

const TaskLastViewedModal = ({ taskId, onClose }) => {
    const [history, setHistory] = useState([]);
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('create_date');
    const showNotification = useNotification();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const tasksResponse = await axios.get(API_ENDPOINTS.GET_RECENTLY_VISITORS, {
                    params: {
                        task_id: taskId,
                    },
                });
                setHistory(tasksResponse.data);
            } catch (error) {
                showNotification('Error fetching data:' + error);
            }
        };

        fetchTasks();
    }, [taskId, showNotification]);

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedHistory = [...history].sort((a, b) => {
        if (orderBy === 'create_date') {
            const dateComparison = a.create_date.localeCompare(b.create_date);
            if (dateComparison !== 0) return order === 'asc' ? dateComparison : -dateComparison;
            return order === 'asc' ? a.create_hour.localeCompare(b.create_hour) : b.create_hour.localeCompare(a.create_hour);
        }
        return 0;
    });

    return (
        <Modal show={true} onHide={onClose} size="lg" className='mh-100'>
            <Modal.Header closeButton>
                <Modal.Title>
                    Last Viewed tasks ({taskId})
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Visitor</TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'create_date'}
                                        direction={orderBy === 'create_date' ? order : 'asc'}
                                        onClick={() => handleRequestSort('create_date')}
                                        className='text-dark'
                                        sx={{
                                            color: 'black',
                                            '&.Mui-active': {
                                                color: 'black',
                                            },
                                            '& .MuiTableSortLabel-icon': {
                                                color: 'black !important',
                                            },
                                        }}
                                    >
                                        Viewed at
                                    </TableSortLabel>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedHistory.map((row, index) => (
                                <TableRow
                                    key={row.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell>{row.visitors_fk.first_name} {row.visitors_fk.last_name}</TableCell>
                                    <TableCell>{row.create_date}, {row.create_hour}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-outline-dark m-2" type="button" onClick={onClose}>Close</button>
            </Modal.Footer>
        </Modal>
    );
};

export default TaskLastViewedModal;
