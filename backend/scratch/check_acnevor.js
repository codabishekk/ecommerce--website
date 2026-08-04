const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('../models/Product');

async function checkProducts() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');
        
        const products = await Product.find({ name: /Acnevor/i });
        console.log('Products found:', products.map(p => ({ name: p.name, isActive: p.isActive })));
        
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.connection.close();
    }
}

checkProducts();
