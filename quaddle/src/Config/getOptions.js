import axios from 'axios';
import API_ENDPOINTS from '../ApiEndpoints/apiConfig';

const getOptions = async (groupName) => {
    try {
        const response = await axios.get(`${API_ENDPOINTS.TASKOPTIONS}${groupName}`);
        const options = response.data;

        if (!options) {
            console.error(`Options group "${groupName}" not found.`);
            return [];
        }

        const filteredOptions = options.filter(option => option.active);
        return filteredOptions;
    } catch (error) {
        console.error('Error fetching options:', error);
        return [];
    }
};

export default getOptions;
