import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HomeColFirst from '../../HomePage/HomeColFirst';
import getOptionsToAplicationConfig from './getOptionsToAplicationConfig';
import API_ENDPOINTS from '../../ApiEndpoints/apiConfig';
import { useNotification } from '../../Functions/NotificationContext';
import ConfigRenderer from './ConfigRenderer';
import UpdateApplicationConfigForm from './UpdateApplicationConfigForm';

const ApplicationConfig = () => {
    const [configGroups, setConfigGroups] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const showNotification = useNotification();
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [updateOptionData, setUpdateOptionData] = useState({
        id: null,
        groupName: '',
        optionData: null,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const enableSessionTimeout = await getOptionsToAplicationConfig('enableSessionTimeout');
                const searchByXCharacters = await getOptionsToAplicationConfig('searchByXCharacters');

                setConfigGroups([
                    { title: 'enableSessionTimeout', options: enableSessionTimeout },
                    { title: 'searchByXCharacters', options: searchByXCharacters },
                ]);
            } catch (error) {
                showNotification('Error fetching data:' + error);
            }
        };

        fetchData();
    }, [showNotification]);

    const handleUpdateOption = async (updatedOption) => {
        const { groupName, id } = updateOptionData;

        try {
            await axios.put(`${API_ENDPOINTS.APPLICATIONCONFIG}/${groupName}/${id}`, { ...updatedOption });
            showNotification(`Option "${groupName}" updated successfully.`);

            const updatedOptions = await getOptionsToAplicationConfig(groupName);
            const updatedConfigGroups = configGroups.map(group => {
                if (group.title === groupName) {
                    return { ...group, options: updatedOptions };
                }
                return group;
            });

            setConfigGroups(updatedConfigGroups);
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

    const filteredConfigGroups = configGroups.filter(group =>
        group.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="row g-0">
            <HomeColFirst />
            <div className="p-3 col-md-6 text-light dark-bg min-vh-100 border-start border-secondary overflow-auto" style={{ maxHeight: '100vh' }}>
                <h2 className="mb-4">Application Config</h2>
                <label className="text-light mb-2">Search config option:</label>
                <input
                    type="search"
                    className='form-control pe-3 mb-3'
                    placeholder="Enter title to search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <hr className="border-secondary" />

                {filteredConfigGroups.map(group => (
                    <ConfigRenderer
                        key={group.title}
                        title={group.title}
                        options={group.options}
                        handleUpdateOption={(optionId, groupName, optionData) => handleOpenUpdateForm(optionId, groupName, optionData)}
                    />
                ))}
            </div>
            <div className="p-3 col-md-4 text-light dark-bg min-vh-100 border-start border-secondary">
                {showUpdateForm && (
                    <UpdateApplicationConfigForm
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

export default ApplicationConfig;
