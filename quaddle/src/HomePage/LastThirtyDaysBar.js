import React, { PureComponent } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import axios from 'axios';

class LastThirtyDaysBar extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            last30Days: [],
            taskData: [],
        };
    }

    async componentDidMount() {
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


        this.setState({ last30Days: dates });
        try {
            const taskResponse = await axios.get('http://localhost:3500/tasks', {
                params: {
                    createdate: dates,
                },
            });

            this.setState({ taskData: taskResponse.data });
        } catch (error) {
            console.error('Error fetching task data:', error);
        }
    }


    render() {
        const { last30Days, taskData } = this.state;
        const chartData = last30Days.map((date) => {
            const taskCount = Array.isArray(taskData)
                ? taskData.filter(task => {
                    // Convert task.createDate to the same format as date
                    const taskDate = task.createDate.split('-').reverse().join('-'); // Convert "DD-MM-YYYY" to "YYYY-MM-DD"

                    // Compare the formatted dates
                    return taskDate === date;
                }).length
                : 0;
            const taskCountClosed = Array.isArray(taskData)
                ? taskData.filter(task => {
                    // Convert task.createDate to the same format as date
                    const taskDate = task.closeDate.split('-').reverse().join('-'); // Convert "DD-MM-YYYY" to "YYYY-MM-DD"

                    // Compare the formatted dates
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
                    {/* <CartesianGrid strokeDasharray="5 5" /> */}
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip labelClassName='text-dark' />
                    <Legend />
                    <Bar yAxisId="left" dataKey="Tasks" fill="#8884d8" />
                    <Bar yAxisId="left" dataKey="Closed" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
        );

    }
}

export default LastThirtyDaysBar;
