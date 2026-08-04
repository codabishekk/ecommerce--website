const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const Category = require("./models/Category");

dotenv.config();

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB Connected");

        const filter = { isActive: true };
        const sort = { createdAt: 1 };
        const products = await Product.find(filter)
            .populate("category", "name")
            .sort(sort)
            .limit(10);
        
        console.log("Products found:", products.length);

        const total = await Product.countDocuments(filter);
        console.log("Total products count:", total);
        process.exit(0);
    } catch (err) {
        console.error("Test Error:", err);
        process.exit(1);
    }
};

test();
