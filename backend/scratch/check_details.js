const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('../models/Product');

async function checkDetails() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const products = await Product.find({ name: /Acnevor/i });
        products.forEach(p => {
            console.log('---');
            console.log('Name:', p.name);
            console.log('Description:', p.description);
        });
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.connection.close();
    }
}

checkDetails();
