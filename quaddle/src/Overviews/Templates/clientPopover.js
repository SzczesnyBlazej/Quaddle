import React, { useState, useEffect } from 'react';
import { Popover } from 'react-bootstrap';
import findCustomerById from '../Functions/FindCustomerByID';

export const ClientPopover = ({ clientId }) => {
    const [customerData, setCustomerData] = useState(null);

    useEffect(() => {
        const fetchCustomerData = async () => {
            const data = await findCustomerById(clientId);
            setCustomerData(data);
        };

        fetchCustomerData();
    }, [clientId]);

    if (!customerData) {
        // You might want to return a loading state or some other UI here
        return null;
    }

    return (
        <Popover id={clientId} className='p-3 popover'>
            <div>
                <h5 className='mx-auto text-center '>{customerData.name} {customerData.surname}</h5>
                <hr className="border-secondary" />
                <div className='row '>
                    <div className='col-md-6 '>
                        <label htmlFor="email" className="form-label">
                            Email:
                        </label>
                        <div id="email">{customerData.email}</div>
                    </div>
                    <div className='col-md-6'>
                        <label htmlFor="tel" className="form-label">
                            Tel:
                        </label>
                        <div id="tel">{customerData.phone}</div>
                    </div>
                </div>
                <hr className="border-secondary" />

                <div className='row'>
                    <div className='col-md-6 '>
                        <label htmlFor="opened" >
                            Opened:
                        </label>
                        <div id="opened">List of opened task</div>
                        <span className='text-muted'>Show more</span>

                    </div>
                    <div className='col-md-6 '>
                        <label htmlFor="closed" >
                            Closed:
                        </label>
                        <div id="closed">List of closed task</div>
                        <span className='text-muted'>Show more</span>
                    </div>
                </div>
                <hr className="border-secondary" />
                <div className='row mx-auto text-center'>
                    <label htmlFor="userChart" >
                        Closed:
                    </label>
                    <div id="userChart">userChart</div>
                </div>



            </div>
        </Popover>

    );
};
