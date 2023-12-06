// ColumnTemplate.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
const ColumnTemplate = ({ additionalColumns = [] }) => {
    const defaultColumns = [
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
        {
            accessorKey: 'solver',
            header: 'Solver',
            size: 130,
        }
    ];

    const allColumns = [...defaultColumns, ...additionalColumns];

    return allColumns;
};

export default ColumnTemplate;
