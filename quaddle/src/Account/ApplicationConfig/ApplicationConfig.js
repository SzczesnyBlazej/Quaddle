import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HomeColFirst from '../../HomePage/HomeColFirst';
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
                const config = (await axios.get(API_ENDPOINTS.APPLICATIONCONFIG)).data;
                setConfigGroups(config);
            } catch (error) {
                showNotification(`Error fetching data: ${error}`);
            }
        };

        fetchData();
    }, [showNotification]);

    const handleUpdateOption = async (updatedOption) => {
        try {
            await axios.put(`${API_ENDPOINTS.APPLICATIONCONFIG}/${updatedOption.id}/`, { ...updatedOption });
            showNotification(`Option "${updatedOption.title}" updated successfully.`);
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

    const filteredConfigGroups = configGroups
        .filter(group => group?.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="row g-0">
            <HomeColFirst />
            <div className="p-3 col-md-6 text-light dark-bg min-vh-100 border-start border-secondary overflow-auto" style={{ maxHeight: '100vh' }}>
                <h2 className="mb-4">Application Config</h2>
                <label className="text-light mb-2">Search config option:</label>
                <input
                    type="search"
                    className="form-control pe-3 mb-3"
                    placeholder="Enter title to search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <hr className="border-secondary" />
                {filteredConfigGroups.map(option => (
                    <ConfigRenderer
                        key={option?.id}
                        title={option?.title}
                        options={option}
                        handleUpdateOption={(optionId, groupName, optionData) => handleOpenUpdateForm(optionId, groupName, optionData)}
                    />
                ))}
            </div>
            <div className="p-3 col-md-4 text-light dark-bg min-vh-100 border-start border-secondary">
                {showUpdateForm ? (
                    <UpdateApplicationConfigForm
                        handleUpdateOption={handleUpdateOption}
                        groupName={updateOptionData.groupName}
                        initialOption={updateOptionData.optionData}
                        closeUpdateForm={handleCloseUpdateForm}
                    />
                ) : null}
            </div>
        </div>
    );
};

export default ApplicationConfig;
