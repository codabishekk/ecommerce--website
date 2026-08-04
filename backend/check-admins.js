const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const dotenv = require('dotenv');

dotenv.config();

const checkAdmins = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const admins = await Admin.find({}, 'name email role');
        console.log('Current Admins:', JSON.stringify(admins, null, 2));
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

checkAdmins();
