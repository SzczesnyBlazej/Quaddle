import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNotification } from '../Functions/NotificationContext';
import API_ENDPOINTS from '../ApiEndpoints/apiConfig';
import getOptions from '../Config/getOptions';

function DifficultyChart({ user }) {
    const [taskCountsByDifficulty, setTaskCountsByDifficulty] = useState({});
    const showNotification = useNotification();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const difficultyList = await getOptions('difficulty');

                const response = await axios.get(API_ENDPOINTS.TASKS);
                const taskData = response.data;
                const taskDataFiltered = taskData.filter(task => task.solver === user.name);

                const groupedTasks = taskDataFiltered.reduce((groups, task) => {
                    const key = task.difficulty;

                    if (!groups[key]) {
                        groups[key] = [];
                    }

                    groups[key].push(task);

                    return groups;
                }, {});


                const taskCountsByDifficulty = difficultyList.map(difficulty => ({
                    difficulty: `D: ${difficulty}`,
                    count: (groupedTasks[difficulty] || []).length,
                }));

                const resultObject = difficultyList.reduce((acc, currentValue, index) => {
                    acc[`D: ${currentValue}`] = taskCountsByDifficulty[index].count;
                    return acc;
                }, {});

                setTaskCountsByDifficulty(resultObject);

            } catch (error) {
                showNotification('Error fetching task data:', error);

            }
        };

        fetchData();
    }, [user, showNotification]);

    return (
        <ResponsiveContainer height={150}>
            <BarChart
                data={Object.entries(taskCountsByDifficulty).map(([difficulty, count]) => ({ difficulty, count }))}
            >
                <XAxis dataKey="difficulty" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <Tooltip
                    labelClassName='text-dark'
                />
                <Legend
                    payload={[
                        { value: 'Difficulty', type: 'line', color: '#8884d8' },
                    ]}
                />
                <Bar yAxisId="left" dataKey="count" fill="#4D4DFF" />
            </BarChart>
        </ResponsiveContainer>
    );
}

export default DifficultyChart;
