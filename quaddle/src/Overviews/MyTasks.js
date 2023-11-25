// MyTasks.js
import React from 'react';
import HomeColFirst from '../HomePage/HomeColFirst'
import TaskList from './TaskList';
import MenuTaskList from './MenuTaskList';

const MyTasks = () => {

    return (
        <div>
            <div className="row g-0 ">

                {/* First Column */}
                <HomeColFirst />

                {/* Second Column */}
                <MenuTaskList />

                {/* Third Column */}
                <TaskList />

            </div>
        </div>
    );
};

export default MyTasks;
