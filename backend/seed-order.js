const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('./models/Order');
const User = require('./models/User');
const Product = require('./models/Product');
const Category = require('./models/Category');

dotenv.config();

const seedAll = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // 1. Get or Create User
        let user = await User.findOne();
        if (!user) {
            console.log('No user found, creating dummy user...');
            user = await User.create({
                name: 'Test Admin',
                email: 'admin@test.com',
                password: 'password123',
                isAdmin: true
            });
        }

        // 2. Create Category
        console.log('Creating dummy category...');
        const category = await Category.create({
            name: 'Beauty',
            description: 'Beauty and health products',
            icon: 'sparkles'
        });

        // 3. Create Product
        console.log('Creating dummy product...');
        const product = await Product.create({
            name: 'Sample Skincare Bottle',
            description: 'A premium skincare bottle for testing.',
            price: 1200,
            category: category._id,
            stock: 50,
            images: ['sample.jpg'],
            brand: 'Sholash',
            isActive: true
        });

        // 4. Create Order
        console.log('Creating dummy order...');
        const order = await Order.create({
            user: user._id,
            products: [
                {
                    product: product._id,
                    name: product.name,
                    qty: 1,
                    price: product.price,
                }
            ],
            totalPrice: product.price,
            paymentStatus: 'pending',
            paymentMethod: 'COD',
            orderStatus: 'processing',
            shippingAddress: {
                street: '123 Main St',
                city: 'Mumbai',
                state: 'Maharashtra',
                zip: '400001',
                country: 'India'
            }
        });

        console.log('Seed successful!');
        console.log('Order ID:', order._id);
        process.exit(0);
    } catch (error) {
        console.error('Seed failed:', error);
        process.exit(1);
    }
};

seedAll();
