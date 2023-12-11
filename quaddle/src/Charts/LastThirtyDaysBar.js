import React, { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import axios from 'axios';
import { useNotification } from '../Functions/NotificationContext';

const LastThirtyDaysBar = () => {
    const [last30Days, setLast30Days] = useState([]);
    const [taskData, setTaskData] = useState([]);
    const showNotification = useNotification();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const today = new Date();
                const lastMonth = new Date(today);
                lastMonth.setMonth(today.getMonth() - 1);

                const dates = [];
                for (let i = 0; i <= 31; i++) {
                    const date = new Date(lastMonth);
                    date.setDate(lastMonth.getDate() + i);
                    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
                        .toString()
                        .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
                    dates.push(formattedDate);
                }

                setLast30Days(dates);

                const taskResponse = await axios.get('http://localhost:3502/tasks', {
                    params: {
                        createdate: dates,
                    },
                });

                setTaskData(taskResponse.data);
            } catch (error) {
                showNotification('Error fetching task data:', error);
            }
        };

        fetchData();
    }, [showNotification]);

    const chartData = last30Days.map((date) => {
        const taskCount = Array.isArray(taskData)
            ? taskData.filter(task => {
                const taskDate = task.createDate.split('-').reverse().join('-');
                return taskDate === date;
            }).length
            : 0;

        const taskCountClosed = Array.isArray(taskData)
            ? taskData.filter(task => {
                const taskDate = task.closeDate.split('-').reverse().join('-');
                return taskDate === date;
            }).length
            : 0;

        return {
            name: date,
            Tasks: taskCount,
            Closed: taskCountClosed,
        };
    });

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
                <Bar yAxisId="left" dataKey="Tasks" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="Closed" fill="#82ca9d" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default LastThirtyDaysBar;
