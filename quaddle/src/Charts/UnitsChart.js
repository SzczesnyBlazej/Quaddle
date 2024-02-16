import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import API_ENDPOINTS from '../ApiEndpoints/apiConfig';

function UnitsChart({ user }) {
    const [taskCountsByUnits, setTaskCountsByUnits] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(API_ENDPOINTS.GET_UNITS_COUNTS, {
                    params: {
                        userID: user.id
                    }
                });

                setTaskCountsByUnits(response.data.taskCountsByUnits);
            } catch (error) {
                console.error('Error fetching task data:', error);
            }
        };

        fetchData();
    }, [user]);

    return (
        <ResponsiveContainer height={150}>
            <BarChart
                data={taskCountsByUnits}
            >
                <XAxis dataKey="units" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <Tooltip labelClassName='text-dark' />
                <Legend
                    payload={[
                        { value: 'Units', type: 'line', color: '#8884d8' },
                    ]}
                />
                <Bar
                    yAxisId="left"
                    dataKey="count"
                    fill="#FF66B2"
                    name="Count"
                />
            </BarChart>
        </ResponsiveContainer>
    );
}

export default UnitsChart;
