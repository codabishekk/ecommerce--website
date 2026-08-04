const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    try {
        await Product.updateOne(
            { name: { $regex: 'Calgro' } },
            { $set: { images: ['/src/assets/product image/tablets1.png', '/src/assets/product image/tablets2.png', '/src/assets/product image/tablets3.png', '/src/assets/product image/tablets4.png'], image: '/src/assets/product image/tablets3.png' } }
        );
        console.log('Fixed Calgro images in DB');

        // Check if there are other broken images like glazzium etc.. wait, let's fix Acnevor CN just in case
        await Product.updateOne(
            { name: { $regex: 'Acnevor CN' } },
            { $set: { images: ['/src/assets/PRODUCT HOME IMAGE/Acnevor CN.png', '/src/assets/product image/Acnevor CN with Box.png', '/src/assets/product image/Acnevor CN -1.png'], image: '/src/assets/PRODUCT HOME IMAGE/Acnevor CN.png' } }
        );

        // Ceramois
        await Product.updateOne(
            { name: { $regex: 'Ceramois' } },
            { $set: { images: ['/src/assets/PRODUCT HOME IMAGE/lotion.png', '/src/assets/product image/skin care routine -1.png', '/src/assets/product image/skin care routine -3.png', '/src/assets/product image/lotion with model-1.png'], image: '/src/assets/PRODUCT HOME IMAGE/lotion.png' } }
        );

        console.log('Update complete');
    } catch (err) {
        console.error(err);
    } finally {
        process.exit(0);
    }
});
