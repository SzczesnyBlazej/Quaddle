import React, { useState, useEffect } from 'react';
import axios from 'axios';  // Import Axios for making HTTP requests
import HomeColFirst from '../../HomePage/HomeColFirst';
import getOptionsToAplicationConfig from './getOptionsToAplicationConfig';
// import getOptionsToManager from './getOptionsToManager';
// import OptionRenderer from './OptionRenderer';
import API_ENDPOINTS from '../../ApiEndpoints/apiConfig';
import { useNotification } from '../../Functions/NotificationContext';
import ConfigRenderer from './ConfigRenderer';
import UpdateApplicationConfigForm from './UpdateApplicationConfigForm';

const ApplicationConfig = () => {
    const [sessionTimeout, setSessionTimeout] = useState([]);
    const [searchByXCharacters, setSearchByXCharacters] = useState([]);
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
                setSessionTimeout(enableSessionTimeout);
                const EnableSearchByXCharacters = await getOptionsToAplicationConfig('searchByXCharacters');
                setSearchByXCharacters(EnableSearchByXCharacters);

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

            switch (groupName) {
                case 'enableSessionTimeout':
                    setSessionTimeout(updatedOptions);
                    break;
                case 'searchByXCharacters':
                    setSearchByXCharacters(updatedOptions);
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
    return (
        <div className="row g-0">
            <HomeColFirst />
            <div className="p-3 col-md-6 text-light dark-bg min-vh-100 border-start border-secondary overflow-auto" style={{ maxHeight: '100vh' }}>
                <h2 className="mb-4">Application Config</h2>
                <ConfigRenderer
                    title="enableSessionTimeout"
                    options={sessionTimeout}
                    handleUpdateOption={(optionId, groupName, optionData) => handleOpenUpdateForm(optionId, groupName, optionData)}
                />
                <ConfigRenderer
                    title="searchByXCharacters"
                    options={searchByXCharacters}
                    handleUpdateOption={(optionId, groupName, optionData) => handleOpenUpdateForm(optionId, groupName, optionData)}
                />
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
    )
};
export default ApplicationConfig;
