import React from 'react';
import { useMaterialReactTable, MaterialReactTable } from 'material-react-table';
import { Link } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleDot } from '@fortawesome/free-solid-svg-icons';
import { OverlayTrigger } from 'react-bootstrap';
import AsyncClientData from './Functions/AsyncClientData';
import { ClientPopover } from './Templates/clientPopover';
import { getStatusIconColor } from '../Tasks/Functions';


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
            header: 'Status Icon',
            Cell: ({ row }) => (
                <div className='text-center'>
                    <FontAwesomeIcon
                        icon={faCircleDot}
                        style={{
                            color: getStatusIconColor(row.original.status),
                        }}
                    />
                </div>
            ),
            disableFilters: true,
            disableColumnMenu: true,
            maxSize: 10,
            enableColumnActions: false,

        },
        {
            accessorKey: 'id',
            header: 'ID',
            maxSize: 100,

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
                        style={{
                            display: 'inline-block',
                            maxHeight: '30px',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {row.original.title}
                    </div>
                    <Tooltip id="my-tooltip-styles" arrowColor="transparent" />
                </Link>
            ),
            size: 200,
        },
        {
            id: 'clientID',
            accessorKey: 'clientID',
            header: 'Client',
            size: 130,
            Cell: ({ row }) => (
                <>
                    <OverlayTrigger
                        trigger={['click']}
                        placement="right"
                        rootClose
                        overlay={ClientPopover({ clientId: row.original.clientID })}
                    >
                        <Link to={'#'} className='nav-link'>
                            <AsyncClientData clientId={row.original.clientID} />
                        </Link>
                    </OverlayTrigger>

                </>
            ),
        },
        {
            accessorKey: 'unit',
            header: 'Unit',
            size: 100,

        },
        {
            accessorKey: 'priority',
            header: 'Priority',
            size: 100,

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

    const allColumns = columnaaaaa[0].accessorKey === undefined ? existingColumns : [...existingColumns, ...columnaaaaa];

    const table = useMaterialReactTable({
        columns: allColumns,
        data: tasks,
        enableSearch: true,
        defaultColumn: {
            maxSize: 300,
            minSize: 10,
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
