const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('../models/Product');

async function countProducts() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const count = await Product.countDocuments({ isActive: true });
        console.log('Total active products:', count);
        
        const allProducts = await Product.find({ isActive: true }).select('name');
        const acnevor = allProducts.find(p => p.name.includes('Acnevor CN'));
        if (acnevor) {
            console.log('Acnevor CN full name:', acnevor.name);
            console.log('Char codes:', acnevor.name.split('').map(c => c.charCodeAt(0)));
        }
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.connection.close();
    }
}

countProducts();
