import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import API_ENDPOINTS from '../ApiEndpoints/apiConfig';

function PriorityChart({ user }) {
    const [taskCountsByPriority, setTaskCountsByPriority] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(API_ENDPOINTS.GET_PRIORITY_COUNTS, {
                    params: {
                        userID: user.id
                    }
                });

                setTaskCountsByPriority(response.data.taskCountsByPriority);
            } catch (error) {
                console.error('Error fetching task data:', error);
            }
        };

        fetchData();
    }, [user]);

    return (
        <ResponsiveContainer height={150}>
            <BarChart
                data={taskCountsByPriority}
            >
                <XAxis dataKey="priority" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <Tooltip labelClassName='text-dark' />
                <Legend
                    payload={[
                        { value: 'Priority', type: 'line', color: '#8884d8' },
                    ]}
                />
                <Bar
                    yAxisId="left"
                    dataKey="count"
                    fill="#FFA500"
                    name="Count"
                />
            </BarChart>
        </ResponsiveContainer>
    );
}

export default PriorityChart;
