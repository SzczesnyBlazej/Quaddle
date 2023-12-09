import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { UnitEnum } from '../Enums/UnitEnum';


function UnitsChart({ user }) {
    const [taskCountsByUnit, setTaskCountsByUnit] = useState({
        ZRR: 0,
        IT: 0,
        ZDO: 0,
        ZDM: 0,
        SOR: 0,
        CHIR: 0,
        NEURO: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3500/tasks');
                const taskData = response.data;
                // const taskDataFiltered = taskData.filter(task => task.solver === user.name);

                const groupedTasks = taskData.reduce((groups, task) => {
                    const key = task.unit;

                    if (!groups[key]) {
                        groups[key] = [];
                    }

                    groups[key].push(task);

                    return groups;
                }, {});

                const allUnits = Object.keys(UnitEnum);

                const taskCountsByUnit = allUnits.map(unit => ({
                    unit,
                    count: (groupedTasks[unit] || []).length,
                }));

                setTaskCountsByUnit(
                    Object.fromEntries(
                        taskCountsByUnit.map(({ unit, count }) => [unit, count])
                    )
                );
            } catch (error) {
                console.error('Error fetching task data:', error);
            }
        };

        fetchData();
    }, [user]);

    return (
        <ResponsiveContainer height={150}>
            <BarChart
                data={Object.entries(taskCountsByUnit).map(([unit, count]) => ({ unit, count }))}
            >
                <XAxis dataKey="unit" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <Tooltip
                    labelClassName='text-dark'
                />
                <Legend
                    payload={[
                        { value: 'Units', type: 'line', color: '#8884d8' },
                    ]} />
                <Bar yAxisId="left" dataKey="count" fill="#FF66B2" />
            </BarChart>
        </ResponsiveContainer>
    );
}

export default UnitsChart;
