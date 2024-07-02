import React, { useEffect, useState } from 'react';
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
import Box from '@mui/material/Box';
import LoadingSpinner from '../spinner';
import CircularProgress from '@mui/material/CircularProgress';


const TaskList = ({ tasks, columnaaaaa }) => {
    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        if (tasks.length > 0) {
            setDataLoaded(true);
        } else {
            setDataLoaded(true);
        }
    }, [tasks]);
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
            header: 'Client',
            size: 130,
            Cell: ({ row }) => (
                <>

                    <OverlayTrigger
                        trigger={['click']}
                        placement="auto"
                        rootClose
                        overlay={ClientPopover({ client: row.original.client_fk })}
                    >
                        <Link to={'#'} className='nav-link'>
                            <AsyncClientData clientId={row.original.client_fk.id} />
                        </Link>
                    </OverlayTrigger>
                </>
            ),
            enableColumnActions: false,
            disableFilters: true,
            disableColumnMenu: true,
        },
        {
            header: 'Unit',
            size: 100,
            accessorKey: 'unit',
            Cell: ({ row }) => (
                row.original.unit_fk && row.original.unit_fk.value !== undefined
                    ? row.original.unit_fk.value
                    : <CircularProgress size={24} />
            ),
        },
        {
            accessorKey: 'priority',
            header: 'Priority',
            size: 100,
            Cell: ({ cell }) => (
                <Box
                    sx={(theme) => ({
                        backgroundColor:
                            cell.row.original.priority_fk.value === "1"
                                ? theme.palette.success.dark
                                : cell.row.original.priority_fk.value === "2"
                                    ? theme.palette.warning.light
                                    : theme.palette.error.dark,
                        borderRadius: '0.25rem',
                        p: '0.4rem',
                        opacity: 0.75,
                    })}
                >
                    {cell.row.original.priority_fk.value}
                </Box>
            ),
        },
        {
            id: 'difficulty',
            accessorKey: 'difficulty',
            header: 'Difficulty',
            size: 100,
            Cell: ({ row }) => (row.original.difficulty_fk ? row.original.difficulty_fk.value : '---')

        },
        {
            accessorKey: 'status',
            header: 'Status',
            size: 130,
            Cell: ({ row }) => (row.original.status_fk ? row.original.status_fk.value : '---')

        },
        {
            accessorFn: (row) => `${row.create_date} ${row.create_hour}`,
            header: 'Created',
            size: 140,
        },
        {
            accessorFn: (row) => `${row.last_modification} ${row.last_modification_hour}`,
            header: 'Last Modification',
            id: 'LastModification',
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
            {dataLoaded ? (
                <div className="table-responsive" style={{ maxHeight: '100vh', overflowY: 'auto' }}>
                    <ThemeProvider theme={darkTheme}>
                        <MaterialReactTable table={table} />
                    </ThemeProvider>
                </div>
            ) : (

                <div><LoadingSpinner />
                </div>
            )}
        </div>
    );
};

export default TaskList;
