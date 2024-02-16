import axios from 'axios';
import API_ENDPOINTS from '../../ApiEndpoints/apiConfig';

const getSolverList = async () => {
    try {
        const { data: csrfToken } = await axios.get(API_ENDPOINTS.USER_DATA);

        const response = await axios.get(API_ENDPOINTS.SOLVERS_LIST, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
        });
        return response.data;

    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
};

export default getSolverList;
