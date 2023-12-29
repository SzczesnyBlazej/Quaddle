import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import API_ENDPOINTS from '../ApiEndpoints/apiConfig';
import getOptions from '../Config/getOptions';

function PriorityChart({ user }) {
    const [taskCountsByPriority, setTaskCountsByPriority] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const priorityList = await getOptions('priority');
                const response = await axios.get(API_ENDPOINTS.TASKS);
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


                const taskCountsByPriority = priorityList.map(priority => ({
                    priority: `P: ${priority}`,
                    count: (groupedTasks[priority] || []).length,
                }));

                const resultObject = priorityList.reduce((acc, currentValue, index) => {
                    acc[`P: ${currentValue}`] = taskCountsByPriority[index].count;
                    return acc;
                }, {});

                setTaskCountsByPriority(resultObject);
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
                <Tooltip labelClassName='text-dark' />
                <Legend
                    payload={[
                        { value: 'Priority', type: 'line', color: '#8884d8' },
                    ]}
                />
                <Bar yAxisId="left" dataKey="count" fill="#FFA500" />
            </BarChart>
        </ResponsiveContainer>
    );
}

export default PriorityChart;
