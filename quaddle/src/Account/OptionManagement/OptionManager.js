import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HomeColFirst from '../../HomePage/HomeColFirst';
import getOptionsToManager from './getOptionsToManager';
import API_ENDPOINTS from '../../ApiEndpoints/apiConfig';
import { useNotification } from '../../Functions/NotificationContext';
import OptionRenderer from './OptionRenderer';
import AddOptionForm from './AddOptionForm';
import UpdateOptionForm from './UpdateOptionForm';

const OptionManager = () => {
    const [optionGroups, setOptionGroups] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [searchTerm, setSearchTerm] = useState(''); // Dodaj ten stan

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
                const priorityList = await getOptionsToManager('priority');
                const difficultyList = await getOptionsToManager('difficulty');
                const statusList = await getOptionsToManager('status');
                const unitList = await getOptionsToManager('units');

                setOptionGroups([
                    { title: 'Priority', options: priorityList, groupName: 'priority' },
                    { title: 'Difficulty', options: difficultyList, groupName: 'difficulty' },
                    { title: 'Status', options: statusList, groupName: 'status' },
                    { title: 'Units', options: unitList, groupName: 'units' },
                ]);
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
            const updatedOptionGroups = optionGroups.map(group => {
                if (group.groupName === groupName) {
                    return { ...group, options: updatedOptions };
                }
                return group;
            });

            setOptionGroups(updatedOptionGroups);
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
            const updatedOptionGroups = optionGroups.map(group => {
                if (group.groupName === groupName) {
                    return { ...group, options: updatedOptions };
                }
                return group;
            });

            setOptionGroups(updatedOptionGroups);
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

    // Dodaj obsługę zmiany wartości w polu wyszukiwania
    const handleSearchTermChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Filtruj grupy opcji na podstawie wprowadzonego terminu wyszukiwania
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
