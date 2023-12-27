import React, { useState, useEffect } from 'react';
import axios from 'axios';  // Import Axios for making HTTP requests
import HomeColFirst from '../../HomePage/HomeColFirst';
import getOptionsToManager from './getOptionsToManager';
import OptionRenderer from './OptionRenderer';
import API_ENDPOINTS from '../../ApiEndpoints/apiConfig';
import { useNotification } from '../../Functions/NotificationContext';

const OptionManager = () => {
    const [priorityOptions, setPriorityOptions] = useState([]);
    const [difficultyOptions, setDifficultyOptions] = useState([]);
    const [statusOptions, setStatusOptions] = useState([]);
    const [unitsOptions, setUnitsOptions] = useState([]);
    const showNotification = useNotification();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const priorityList = await getOptionsToManager('priority');
                setPriorityOptions(priorityList);
                const difficultyList = await getOptionsToManager('difficulty');
                setDifficultyOptions(difficultyList);
                const statusList = await getOptionsToManager('status');
                setStatusOptions(statusList);
                const unitList = await getOptionsToManager('units');
                setUnitsOptions(unitList);
            } catch (error) {
                showNotification('Error fetching data:' + error);

            }
        };

        fetchData();
    }, [showNotification]);

    const handleDelete = async (optionId, groupName) => {
        try {
            await axios.delete(`${API_ENDPOINTS.OPTIONS}/${groupName}/${optionId}`);
            showNotification('Option deleted successfully.');

            const updatedOptions = await getOptionsToManager(groupName);
            switch (groupName) {
                case 'priority':
                    setPriorityOptions(updatedOptions);
                    break;
                case 'difficulty':
                    setDifficultyOptions(updatedOptions);
                    break;
                case 'status':
                    setStatusOptions(updatedOptions);
                    break;
                case 'units':
                    setUnitsOptions(updatedOptions);
                    break;
                default:
                    break;
            }
        } catch (error) {
            showNotification('Error deleting option:' + error);

        }
    };

    return (
        <div className="row g-0">
            <HomeColFirst />
            <div className="p-3 col-md-6 text-light dark-bg min-vh-100 border-start border-secondary overflow-auto" style={{ maxHeight: '100vh' }}>
                <h2 className="mb-4">Option Management</h2>
                <OptionRenderer title="Priority" options={priorityOptions} handleDelete={(optionId) => handleDelete(optionId, 'priority')} />
                <OptionRenderer title="Difficulty" options={difficultyOptions} handleDelete={(optionId) => handleDelete(optionId, 'difficulty')} />
                <OptionRenderer title="Status" options={statusOptions} handleDelete={(optionId) => handleDelete(optionId, 'status')} />
                <OptionRenderer title="Units" options={unitsOptions} handleDelete={(optionId) => handleDelete(optionId, 'units')} />
            </div>
            <div className="p-3 col-md-4 text-light dark-bg min-vh-100 border-start border-secondary">
                {/* Additional content for the right column */}
            </div>
        </div>
    );
};

export default OptionManager;
