const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Category = require("./models/Category");

dotenv.config();

const defaultCategories = [
    { name: "Lotion & Moisturizer", description: "Deep hydration and skin barrier restoration lotions" },
    { name: "Serum & Treatment", description: "Concentrated skin repair serums and active care" },
    { name: "Cleanser & Face Wash", description: "Gentle daily facial cleansers and scrubs" },
    { name: "Sun Protection & Sunscreen", description: "Broad-spectrum UV protection creams" },
    { name: "Body Care", description: "Nourishing body washes, lotions, and creams" },
    { name: "Hair & Scalp Care", description: "Therapeutic hair oils and shampoo formulations" },
    { name: "Baby & Sensitive Care", description: "Hypoallergenic products for delicate skin" }
];

const seedCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB for Category seeding...");

        for (const cat of defaultCategories) {
            await Category.updateOne(
                { name: cat.name },
                { $setOnInsert: cat },
                { upsert: true }
            );
        }

        console.log("Categories seeded successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Seeding categories failed:", err);
        process.exit(1);
    }
};

seedCategories();
