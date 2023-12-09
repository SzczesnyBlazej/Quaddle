import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function PriorityChart({ user }) {
    const [taskCountsByPriority, setTaskCountsByPriority] = useState({
        priorityOne: 0,
        priorityTwo: 0,
        priorityThree: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3500/tasks');
                const taskData = response.data;
                const taskDataFiltered = taskData.filter(task => task.solver === user.name);

                const groupedTasks = taskDataFiltered.reduce((groups, task) => {
                    const key = task.priority;

                    if (!groups[key]) {
                        groups[key] = [];
                    }

                    groups[key].push(task);

                    return groups;
                }, {});

                const allPriorities = [1, 2, 3];

                const taskCountsByPriority = allPriorities.map(priority => ({
                    priority: `Priority ${priority}`,
                    count: (groupedTasks[priority] || []).length,
                }));

                setTaskCountsByPriority({
                    "Priority 1": taskCountsByPriority[0].count,
                    "Priority 2": taskCountsByPriority[1].count,
                    "Priority 3": taskCountsByPriority[2].count,
                });
            } catch (error) {
                console.error('Error fetching task data:', error);
            }
        };

        fetchData();
    }, [user]);

    return (
        <ResponsiveContainer height={150}>
            <BarChart
                data={Object.entries(taskCountsByPriority).map(([priority, count]) => ({ priority, count }))}
            >
                <XAxis dataKey="priority" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <Tooltip
                    labelClassName='text-dark'
                />
                <Legend
                    payload={[
                        { value: 'Priority', type: 'line', color: '#8884d8' },
                    ]} />
                <Bar yAxisId="left" dataKey="count" fill="#FFA500" />
            </BarChart>
        </ResponsiveContainer>
    );
}

export default PriorityChart;
