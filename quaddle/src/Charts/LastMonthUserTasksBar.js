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
import API_ENDPOINTS from '../ApiEndpoints/apiConfig';

const LastMonthUserTasksBar = ({ userId }) => {
    const [last14Days, setLast14Days] = useState([]);
    const [taskData, setTaskData] = useState([]);
    const showNotification = useNotification();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const today = new Date();
                const lastTwoWeeks = new Date(today);
                lastTwoWeeks.setDate(today.getDate() - 13);

                const dates = [];
                for (let i = 0; i <= 13; i++) {
                    const date = new Date(lastTwoWeeks);
                    date.setDate(lastTwoWeeks.getDate() + i);
                    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
                        .toString()
                        .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
                    dates.push(formattedDate);
                }

                setLast14Days(dates);

                const taskResponse = await axios.get(API_ENDPOINTS.TASKS, {
                    params: {
                        clientID: userId,
                        createdate: dates,
                    },
                });

                setTaskData(taskResponse.data);
            } catch (error) {
                showNotification('Error fetching task data:', error);
            }
        };

        fetchData();
    }, [showNotification, userId]);

    const chartData = last14Days.map((date) => {
        const taskCount = Array.isArray(taskData)
            ? taskData.filter(task => {
                const taskDate = task.createDate.split('-').reverse().join('-');
                return taskDate === date;
            }).length
            : 0;

        const taskCountClosed = Array.isArray(taskData)
            ? taskData.filter(task => {
                const taskDate = task.closeDate.split('-').reverse().join('-');
                return taskDate === date && task.status === 'Close';
            }).length
            : 0;

        return {
            name: date,
            Opened: taskCount,
            Closed: taskCountClosed,
        };
    });

    return (
        <ResponsiveContainer height={150}>
            <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
            >
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip labelClassName='text-dark' />
                <Legend />
                <Bar yAxisId="left" dataKey="Opened" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="Closed" fill="#82ca9d" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default LastMonthUserTasksBar;
