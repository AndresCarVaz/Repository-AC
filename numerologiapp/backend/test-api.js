const axios = require('axios');

async function testApi() {
    try {
        console.log('Logging in...');
        const loginRes = await axios.post('http://localhost:3000/api/auth/login', {
            email: 'admin123@admin.com',
            password: 'admin123'
        });
        
        const token = loginRes.data.token;
        console.log('Got token:', token ? 'yes' : 'no');

        console.log('\nFetching generic readings...');
        const readingsRes = await axios.get('http://localhost:3000/api/readings', {
            headers: { 'x-token': token }
        });
        console.log('Readings fetch status:', readingsRes.status);

        console.log('\nGenerating main reading (might be cached)...');
        const mainRes = await axios.post('http://localhost:3000/api/readings/main', {}, {
            headers: { 'x-token': token }
        });
        console.log('Main reading generation status:', mainRes.status);

        console.log('\nAll tests passed successfully!');
    } catch (error) {
        console.error('\nTest failed:', error.response ? `${error.response.status} - ${JSON.stringify(error.response.data)}` : error.message);
    }
}

testApi();
