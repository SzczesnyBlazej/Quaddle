import axios from 'axios';
import API_ENDPOINTS from '../../ApiEndpoints/apiConfig';

const getOptionsToManager = async (groupName) => {
    try {
        const response = await axios.get(`${API_ENDPOINTS.OPTIONS}/${groupName}`);
        const options = response.data;

        if (!options) {
            console.error(`Options group "${groupName}" not found.`);
            return [];
        }

        return options;
    } catch (error) {
        console.error('Error fetching options:', error);
        return [];
    }
};

export default getOptionsToManager;
