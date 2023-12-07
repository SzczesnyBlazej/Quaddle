// TaskList.js
import React from 'react';
import { useMaterialReactTable, MaterialReactTable } from 'material-react-table';
import { Link } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const TaskList = ({ tasks, columnaaaaa }) => {
    const darkTheme = createTheme({
        palette: {
            background: {
                default: '#161820',
                paper: '#666',
            },
            text: {
                primary: '#fff',
                secondary: '#ffffff',
            },
        },
    });

    // Existing columns
    const existingColumns = [
        {
            accessorKey: 'id',
            header: 'id',
            size: 30,
        },
        {
            id: 'title',
            header: 'Title',
            accessorKey: 'title',
            Cell: ({ row }) => (
                <Link to={`/tasks/${row.original.id}`} className="nav-link">
                    <div
                        data-tooltip-id="my-tooltip-styles"
                        data-tooltip-content={row.original.title}
                        className="truncate-text"
                        style={{ display: 'inline-block', maxHeight: '30px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                    >
                        {row.original.title}

                    </div>
                    <Tooltip id="my-tooltip-styles" arrowColor="transparent" />
                </Link>
            ),
            size: 200,
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
    // Combine existing columns with additional columns
    const allColumns = [...existingColumns, ...columnaaaaa];

    const table = useMaterialReactTable({
        columns: allColumns,
        data: tasks,
        enableSearch: true,
        defaultColumn: {
            maxSize: 300,
            minSize: 80,
            size: 160,
        },
        enableColumnResizing: true,
        columnResizeMode: 'onChange',
    });

    return (

        <div className="p-3 col-md-8 text-light dark-bg min-vh-100 border-start border-secondary">

            <div className="table-responsive" style={{ maxHeight: '100vh', overflowY: 'auto' }}>
                <ThemeProvider theme={darkTheme}>
                    <MaterialReactTable table={table} />
                </ThemeProvider>
            </div>
        </div>
    );
};

export default TaskList;
