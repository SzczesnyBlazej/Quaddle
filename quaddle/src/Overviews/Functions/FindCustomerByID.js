import axios from 'axios';

const getAllUsers = async () => {
    try {
        const response = await axios.get('http://localhost:3501/users');
        return response.data.map(user => ({ id: user.id, name: user.name, surname: user.surname, email: user.email, phone: user.phone }));
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
};


// Function to find a user by ID
const findCustomerById = async (customerId) => {
    const users = await getAllUsers();
    const findex = users.find(user => user.id === customerId) || null;

    return findex
};

export default findCustomerById;
