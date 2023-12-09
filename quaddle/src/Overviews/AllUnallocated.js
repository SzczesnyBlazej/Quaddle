import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HomeColFirst from '../HomePage/HomeColFirst';
import TaskList from './TaskList';
import MenuTaskList from './MenuTaskList';
import findCustomerById from './Functions/FindCustomerByID';
import { Link } from 'react-router-dom';

function AllUnallocated() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        axios
            .get(`http://localhost:3500/tasks`, {
                params: {
                    status: ['Open', 'In Pendend'],
                    solver: '',
                },
            })
            .then((response) => {
                setTasks(response.data);
            })
            .catch((error) => {
                console.error('Error fetching tasks:', error);
            });
    }, []);

    const additionalColumns = [
        {
            id: 'clientID',
            accessorKey: 'clientID',
            header: 'Client',
            size: 130,
            Cell: ({ row }) => <Link to={'#'} className='nav-link'><AsyncClientData clientId={row.original.clientID} /></Link>,
        },

    ];

    const AsyncClientData = ({ clientId }) => {
        const [customer, setCustomer] = useState(null);

        useEffect(() => {
            const fetchCustomer = async () => {
                const customerData = await findCustomerById(clientId);
                setCustomer(customerData);
            };

            fetchCustomer();
        }, [clientId]);

        if (!customer) {
            return 'Loading...';
        }

        return `${customer.name} ${customer.surname}`;
    };

    return (
        <div>
            <div className="row g-0 ">
                <HomeColFirst />
                <MenuTaskList />
                <TaskList tasks={tasks} columnaaaaa={additionalColumns} />
            </div>
        </div>
    );
}

export default AllUnallocated;
