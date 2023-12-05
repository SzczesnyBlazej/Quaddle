import React from 'react';
import { useMaterialReactTable, MaterialReactTable } from 'material-react-table';
import { Link } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const TaskList = ({ tasks }) => {
    const darkTheme = createTheme({
        palette: {
            background: {
                default: '#161820', // Default background color
                paper: '#666', // Paper color (background of components)
            },
            text: {
                primary: '#fff', // Text color
                secondary: '#ffffff', // Secondary text color
            },
        },
    });

    const columns = [
        {
            accessorKey: 'id',
            header: 'id',
            size: 30,
        },
        {
            accessorKey: 'title',
            header: 'Title',
            accessorFn: (row) => (
                <Link to={`/tasks/${row.id}`} className="nav-link">
                    <div
                        data-tooltip-id="my-tooltip-styles"
                        data-tooltip-content={row.title}
                        className="truncate-text"
                        style={{ display: 'inline-block', maxHeight: '30px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                    >
                        {row.title}
                    </div>
                    <Tooltip id="my-tooltip-styles" arrowColor="transparent" />
                </Link>
            ),
        },
        {
            accessorKey: 'unit',
            header: 'Unit',
            size: 30,
        },
        {
            accessorKey: 'priority',
            header: 'Priority',
            size: 30,
        },
        {
            accessorKey: 'difficulty',
            header: 'Difficulty',
            size: 100,
        },
        {
            accessorKey: 'status',
            header: 'Status',
            size: 130,
        },
        {
            accessorFn: (row) => `${row.createDate} ${row.createHour}`,
            header: 'Created',
            size: 140,
        },
        {
            accessorFn: (row) => `${row.lastModification} ${row.lastModificationHour}`,
            header: 'Last Modification',
            size: 130,
        },
    ];

    const table = useMaterialReactTable({
        columns,
        data: tasks,
        enableSearch: true, // Ensure this is set to true
        defaultColumn: {
            maxSize: 200,
            minSize: 80,
            size: 160,
        },
        enableColumnResizing: true,
        columnResizeMode: 'onChange',
    });

    return (
        <div className="col-md-8 text-light dark-bg min-vh-100 border-start border-secondary">
            <div className="table-responsive" style={{ maxHeight: '100vh', overflowY: 'auto' }}>
                <ThemeProvider theme={darkTheme}>
                    <MaterialReactTable table={table} />
                </ThemeProvider>
            </div>
        </div>
    );
};

export default TaskList;
