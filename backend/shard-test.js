const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
    // Constructing a direct connection to one shard to see if the driver can discover the rest
    const shard0 = 'ac-qeagwyv-shard-00-00.wrdq4oa.mongodb.net:27017';
    const user = 'aimuniverssedevelopers_db_user';
    const pass = 'dlUd4r9i73dUn2wu';
    const db = 'sholash';
    
    // Standard URI without +srv
    const uri = `mongodb://${user}:${pass}@${shard0}/${db}?ssl=true&authSource=admin`;
    
    console.log(`Connecting to: ${uri}`);
    try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
        console.log('✅ Successfully connected to one shard!');
        console.log('Connection Host:', mongoose.connection.host);
        // Sometimes you can find the replica set name in the connection options/state
        console.log('Replica Set:', mongoose.connection.db.databaseName); 
        await mongoose.disconnect();
    } catch (err) {
        console.error('❌ Connection failed:', err.message);
    }
}

testConnection();
