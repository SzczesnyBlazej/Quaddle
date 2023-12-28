import React, { useState, useEffect } from 'react';
import axios from 'axios';  // Import Axios for making HTTP requests
import HomeColFirst from '../../HomePage/HomeColFirst';
import getOptionsToManager from './getOptionsToManager';
import OptionRenderer from './OptionRenderer';
import API_ENDPOINTS from '../../ApiEndpoints/apiConfig';
import { useNotification } from '../../Functions/NotificationContext';
import AddOptionForm from './AddOptionForm';
import UpdateOptionForm from './UpdateOptionForm';

const OptionManager = () => {
    const [priorityOptions, setPriorityOptions] = useState([]);
    const [difficultyOptions, setDifficultyOptions] = useState([]);
    const [statusOptions, setStatusOptions] = useState([]);
    const [unitsOptions, setUnitsOptions] = useState([]);
    const showNotification = useNotification();
    const [showAddForm, setShowAddForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [updateOptionData, setUpdateOptionData] = useState({
        id: null,
        groupName: '',
        optionData: null,
    });
    const [groupName, setGroupName] = useState('');

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
    const handleAddNewOption = (group) => {
        setShowAddForm(true);
        setGroupName(group);
    };
    const handleAddNewOptionSubmit = async (option) => {
        try {
            await axios.post(`${API_ENDPOINTS.OPTIONS}/${groupName}`, { ...option });
            showNotification(`Option by name ${option.name} added successfully`);
            setShowAddForm(false);

        } catch (error) {
            showNotification('Error adding new option:' + error);
        }
    };
    const handleUpdateOption = async (updatedOption) => {

        const { groupName, id } = updateOptionData;

        try {
            await axios.put(`${API_ENDPOINTS.OPTIONS}/${groupName}/${id}`, { ...updatedOption });
            showNotification(`Option by name ${updatedOption.name} updated successfully.`);

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

            setShowUpdateForm(false);
        } catch (error) {
            showNotification(`Error updating option: ${error}`);
        }
    };

    const handleOpenUpdateForm = (optionId, groupName, optionData) => {

        setShowUpdateForm(true);
        setUpdateOptionData({ id: optionId, groupName, optionData });
    };

    const handleCloseUpdateForm = () => {
        setShowUpdateForm(false);
        setUpdateOptionData({ id: null, groupName: '', optionData: null });
    };
    const handleCloseAddForm = () => {
        setShowAddForm(false);

    }

    return (
        <div className="row g-0">
            <HomeColFirst />
            <div className="p-3 col-md-6 text-light dark-bg min-vh-100 border-start border-secondary overflow-auto" style={{ maxHeight: '100vh' }}>
                <h2 className="mb-4">Option Management</h2>
                <OptionRenderer
                    title="Priority"
                    options={priorityOptions}
                    handleDelete={(optionId) => handleDelete(optionId, 'priority')}
                    handleAddOption={() => handleAddNewOption('priority')}
                    handleUpdateOption={(optionId, groupName, optionData) => handleOpenUpdateForm(optionId, groupName, optionData)}
                />

                <OptionRenderer
                    title="Difficulty"
                    options={difficultyOptions}
                    handleDelete={(optionId) => handleDelete(optionId, 'difficulty')}
                    handleAddOption={() => handleAddNewOption('difficulty')}
                    handleUpdateOption={(optionId, groupName, optionData) => handleOpenUpdateForm(optionId, groupName, optionData)}
                />
                <OptionRenderer
                    title="Status"
                    options={statusOptions}
                    handleDelete={(optionId) => handleDelete(optionId, 'status')}
                    handleAddOption={() => handleAddNewOption('status')}
                    handleUpdateOption={(optionId, groupName, optionData) => handleOpenUpdateForm(optionId, groupName, optionData)}
                />
                <OptionRenderer
                    title="Units"
                    options={unitsOptions}
                    handleDelete={(optionId) => handleDelete(optionId, 'units')}
                    handleAddOption={() => handleAddNewOption('units')}
                    handleUpdateOption={(optionId, groupName, optionData) => handleOpenUpdateForm(optionId, groupName, optionData)}
                />
            </div>
            <div className="p-3 col-md-4 text-light dark-bg min-vh-100 border-start border-secondary">
                {showAddForm &&
                    <AddOptionForm
                        handleAddNewOptionSubmit={handleAddNewOptionSubmit}
                        groupName={groupName}
                        closeAddOptionForm={handleCloseAddForm} />}
                {showUpdateForm && (
                    <UpdateOptionForm
                        handleUpdateOption={handleUpdateOption}
                        groupName={updateOptionData.groupName}
                        initialOption={updateOptionData.optionData}
                        closeUpdateForm={handleCloseUpdateForm}
                    />
                )}

            </div>
        </div>
    );
};

export default OptionManager;
