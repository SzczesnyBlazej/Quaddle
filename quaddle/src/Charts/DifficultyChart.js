import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import API_ENDPOINTS from '../ApiEndpoints/apiConfig';

function DifficultyChart({ user }) {
    const [taskCountsByDifficulty, setTaskCountsByDifficulty] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(API_ENDPOINTS.GET_DIFFICULTY_COUNTS, {
                    params: {
                        userID: user.id
                    }
                });

                setTaskCountsByDifficulty(response.data.taskCountsByDifficulty);
            } catch (error) {
                console.error('Error fetching task data:', error);
            }
        };

        fetchData();
    }, [user]);

    return (
        <ResponsiveContainer height={150}>
            <BarChart
                data={taskCountsByDifficulty}
            >
                <XAxis dataKey="difficulty" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <Tooltip labelClassName='text-dark' />
                <Legend
                    payload={[
                        { value: 'Difficulty', type: 'line', color: '#8884d8' },
                    ]}
                />
                <Bar
                    yAxisId="left"
                    dataKey="count"
                    fill="#4D4DFF"
                    name="Count"
                />
            </BarChart>
        </ResponsiveContainer>
    );
}

export default DifficultyChart;
