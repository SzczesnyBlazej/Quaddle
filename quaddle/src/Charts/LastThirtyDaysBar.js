import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import API_ENDPOINTS from '../ApiEndpoints/apiConfig';

const LastThirtyDaysBar = ({ user }) => {
    const [taskCounts, setTaskCounts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(API_ENDPOINTS.GET_LAST_THIRTY_DAYS_COUNT, {
                    params: {
                        userID: user.id
                    }
                });

                setTaskCounts(response.data);
            } catch (error) {
                console.error('Error fetching task data:', error);
            }
        };

        fetchData();
    }, [user]);

    const chartData = Array.from({ length: 30 }, (_, index) => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - index);
        const dateString = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;

        const tasksCreatedCount = taskCounts.tasks_created && taskCounts.tasks_created[dateString] ? taskCounts.tasks_created[dateString] : 0;
        const tasksClosedCount = taskCounts.tasks_closed && taskCounts.tasks_closed[dateString] ? taskCounts.tasks_closed[dateString] : 0;

        return {
            name: dateString,
            'Tasks Created': tasksCreatedCount,
            'Tasks Closed': tasksClosedCount
        };
    }).reverse();

    return (
        <ResponsiveContainer height={350}>
            <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
            >
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip labelClassName='text-dark' />
                <Legend />
                <Bar yAxisId="left" dataKey="Tasks Closed" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="Tasks Created" fill="#82ca9d" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default LastThirtyDaysBar;
