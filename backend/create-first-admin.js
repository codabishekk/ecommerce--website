const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const dotenv = require('dotenv');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const admin = await Admin.create({
            name: 'Sholash Admin',
            email: 'admin@sholash.com',
            password: 'password123',
            role: 'superadmin'
        });
        console.log('Admin created successfully:', admin.email);
        process.exit(0);
    } catch (err) {
        console.error('Error creating admin:', err);
        process.exit(1);
    }
};

createAdmin();
