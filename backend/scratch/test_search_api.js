const axios = require('axios');

async function testSearch() {
    try {
        const res = await axios.get('http://localhost:5000/api/products', {
            params: { search: 'Acnevor CN' }
        });
        console.log('Search results for "Acnevor CN":', res.data.data.map(p => p.name));
    } catch (err) {
        console.error('API call failed. Is the server running?');
    }
}

testSearch();
