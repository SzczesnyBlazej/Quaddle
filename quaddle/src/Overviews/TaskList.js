import React from 'react';

function TaskList() {
    return (
        <div className="col-md-8 dark-bg min-vh-100 border-start border-secondary">
            <h2 className='text-light p-2'>{TaskList.displayName}</h2>
        </div>
    );
}
TaskList.displayName = "My tasks";
export default TaskList;
