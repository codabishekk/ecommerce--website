require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    family: 4
}).then(() => {
    console.log('DB SUCCESS!');
    process.exit(0);
}).catch(e => {
    console.error('DB ERROR:', e.message);
    process.exit(1);
});
