import axios from 'axios';
import API_ENDPOINTS from '../ApiEndpoints/apiConfig';

const getOptions = async (groupName) => {
    try {
        const response = await axios.get(API_ENDPOINTS.OPTIONS);
        const options = response.data && response.data[groupName];

        if (!options) {
            console.error(`Options group "${groupName}" not found.`);
            return [];
        }

        const filteredOptions = options.filter(option => option.active);
        const optionNames = filteredOptions.map(option => option.name);
        return optionNames;
    } catch (error) {
        console.error('Error fetching options:', error);
        return [];
    }
};

export default getOptions;
