const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const resetUserPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const email = 'pradhappns222@gmail.com';
        const user = await User.findOne({ email });
        
        if (!user) {
            console.log('User not found');
            process.exit(1);
        }

        user.password = 'password123'; // New known password
        await user.save();
        
        console.log(`Password reset for ${email} to 'password123'`);
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

resetUserPassword();
