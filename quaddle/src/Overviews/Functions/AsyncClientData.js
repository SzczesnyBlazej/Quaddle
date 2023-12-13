import findCustomerById from './FindCustomerByID';
import { useState, useEffect } from 'react';

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
export default AsyncClientData;
