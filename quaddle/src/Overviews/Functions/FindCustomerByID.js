import axios from 'axios';
import API_ENDPOINTS from '../../ApiEndpoints/apiConfig';

const getAllUsers = async () => {
    try {
        const response = await axios.get(API_ENDPOINTS.USERS);
        return response.data.map(user => ({
            id: user.id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            phone: user.phone,
            initials: user.initials,
            logoColor: user.logoColor,
            isAdmin: user.isAdmin
        }));
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
};


const findCustomerById = async (customerId) => {
    try {
        const users = await getAllUsers();
        const foundUser = users.find(user => user.id === customerId) || null;
        return foundUser;
    } catch (error) {
        console.error('Error finding customer by ID:', error);
        return null;
    }
};

export default findCustomerById;


