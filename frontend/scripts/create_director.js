const axios = require('axios');

const API_BASE = 'http://localhost:9090/api';

async function createDirector() {
  try {
    const payload = {
      email: 'directeur@example.com',
      nomPrenom: 'Directeur Test',
      telephone: '+21650000000',
      password: 'ChangeMe123!',
      roleId: 4
    };

    const res = await axios.post(`${API_BASE}/admin/users`, payload);
    console.log('Created user:', res.data);
  } catch (err) {
    console.error('Error creating director:', err.response?.data || err.message || err);
  }
}

createDirector();
