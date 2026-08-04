const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load env vars
dotenv.config({ path: path.join(__dirname, "../.env") });

const Banner = require("../models/Banner");
const Product = require("../models/Product");

const slugify = (text) => {
    if (!text) return '';
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
};

const migrateBanners = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for migration...");

        const banners = await Banner.find({});
        console.log(`Found ${banners.length} banners to check.`);

        const products = await Product.find({});
        const productMap = {};
        products.forEach(p => {
            productMap[p._id.toString()] = p.name;
        });

        let updatedCount = 0;
        for (const banner of banners) {
            // Check if link matches old format: /product/:id or product/:id
            const oldFormatMatch = banner.link.match(/^\/?product\/([a-f\d]{24})$/);
            
            if (oldFormatMatch) {
                const productId = oldFormatMatch[1];
                const productName = productMap[productId];
                
                if (productName) {
                    const newLink = `/product/${slugify(productName)}/${productId}`;
                    banner.link = newLink;
                    await banner.save();
                    console.log(`Updated banner ${banner._id}: ${newLink}`);
                    updatedCount++;
                } else {
                    console.warn(`Could not find product for ID ${productId} in banner ${banner._id}`);
                }
            } else {
                console.log(`Skipping banner ${banner._id} (already new format or different type): ${banner.link}`);
            }
        }

        console.log(`Migration complete. ${updatedCount} banners updated.`);
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
};

migrateBanners();
