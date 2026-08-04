const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const dotenv = require('dotenv');

dotenv.config();

const resetPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const admin = await Admin.findOne({ email: 'admin@sholash.com' });
        if (!admin) {
            console.log('Admin not found');
            process.exit(1);
        }
        
        admin.password = 'admin123';
        await admin.save();
        
        console.log('Password reset successfully for admin@sholash.com to: admin123');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

resetPassword();
