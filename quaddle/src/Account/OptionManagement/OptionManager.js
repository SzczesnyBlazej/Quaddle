import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HomeColFirst from '../../HomePage/HomeColFirst';
import API_ENDPOINTS from '../../ApiEndpoints/apiConfig';
import { useNotification } from '../../Functions/NotificationContext';
import OptionRenderer from './OptionRenderer';
import AddOptionForm from './AddOptionForm';
import UpdateOptionForm from './UpdateOptionForm';

const OptionManager = () => {
    const [optionGroups, setOptionGroups] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const showNotification = useNotification();
    const [showAddForm, setShowAddForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [updateOptionData, setUpdateOptionData] = useState({
        id: null,
        groupName: '',
        optionData: null,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const priorityList = await axios.get(API_ENDPOINTS.TASKOPTIONS + "Priority");
                const difficultyList = await axios.get(API_ENDPOINTS.TASKOPTIONS + "Difficulty");
                const statusList = await axios.get(API_ENDPOINTS.TASKOPTIONS + "Status");
                const unitList = await axios.get(API_ENDPOINTS.TASKOPTIONS + "Unit");

                setOptionGroups([
                    { title: 'Priority', options: priorityList.data, groupName: 'Priority' },
                    { title: 'Difficulty', options: difficultyList.data, groupName: 'Difficulty' },
                    { title: 'Status', options: statusList.data, groupName: 'Status' },
                    { title: 'Units', options: unitList.data, groupName: 'Unit' },
                ]);
            } catch (error) {
                showNotification('Error fetching data:' + error);
            }
        };

        fetchData();
    }, [showNotification]);

    const handleDelete = async (optionId, groupName) => {
        try {
            await axios.delete(`${API_ENDPOINTS.TASKOPTIONS}delete/${optionId}`);
            showNotification('Option deleted successfully.');

        } catch (error) {
            showNotification('Error deleting option:' + error);
        }
    };

    const handleAddNewOption = (group) => {
        setShowAddForm(true);
        setGroupName(group.groupName);
    };

    const handleAddNewOptionSubmit = async (option) => {
        try {
            await axios.post(`${API_ENDPOINTS.TASKOPTIONS}create`, { ...option });
            showNotification(`Option by name ${option.value} added successfully`);
            setShowAddForm(false);
        } catch (error) {
            showNotification('Error adding new option:' + error);
        }
    };

    const handleUpdateOption = async (updatedOption) => {
        const { groupName, id } = updateOptionData;

        try {
            await axios.put(`${API_ENDPOINTS.TASKOPTIONS}update/${id}/`, { ...updatedOption });
            showNotification(`Option by name ${updatedOption.value} updated successfully.`);

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
    };

    const handleSearchTermChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredOptionGroups = optionGroups.filter(group =>
        group.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="row g-0">
            <HomeColFirst />
            <div className="p-3 col-md-6 text-light dark-bg min-vh-100 border-start border-secondary overflow-auto" style={{ maxHeight: '100vh' }}>
                <h2 className="mb-4">Option Management</h2>
                <label className="text-light mb-2">Search config option:</label>
                <input
                    type="search"
                    className='form-control pe-3 mb-3'
                    placeholder="Enter group name to search"
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                />
                <hr className="border-secondary" />
                {filteredOptionGroups.map(group => (
                    <OptionRenderer
                        key={group.groupName}
                        title={group.title}
                        options={group.options}
                        handleDelete={(optionId) => handleDelete(optionId, group.groupName)}
                        handleAddOption={() => handleAddNewOption(group)}
                        handleUpdateOption={(optionId, groupName, optionData) => handleOpenUpdateForm(optionId, groupName, optionData)}
                    />
                ))}
            </div>
            <div className="p-3 col-md-4 text-light dark-bg min-vh-100 border-start border-secondary">
                {showAddForm && (
                    <AddOptionForm
                        handleAddNewOptionSubmit={handleAddNewOptionSubmit}
                        groupName={groupName}
                        closeAddOptionForm={handleCloseAddForm}
                    />
                )}
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
