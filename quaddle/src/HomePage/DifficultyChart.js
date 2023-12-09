import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNotification } from '../Functions/NotificationContext';

function DifficultyChart({ user }) {
    const [taskCountsByDifficulty, setTaskCountsByDifficulty] = useState({
        difficultyEasy: 0,
        difficultyMedium: 0,
        difficultyHard: 0,
    });
    const showNotification = useNotification();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3500/tasks');
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

                const allDifficulty = ["Easy", "Medium", "Hard"];

                const taskCountsByDifficulty = allDifficulty.map(difficulty => ({
                    difficulty: `Difficulty ${difficulty}`,
                    count: (groupedTasks[difficulty] || []).length,
                }));

                setTaskCountsByDifficulty({
                    "Easy": taskCountsByDifficulty[0].count,
                    "Medium": taskCountsByDifficulty[1].count,
                    "Hard": taskCountsByDifficulty[2].count,
                });
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
