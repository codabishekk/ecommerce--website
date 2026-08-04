const axios = require("axios");

const test = async () => {
    try {
        const res = await axios.get("http://localhost:5000/api/products");
        console.log("Status:", res.status);
        console.log("Data length:", JSON.stringify(res.data).length);
    } catch (err) {
        if (err.response) {
            console.error("Status:", err.response.status);
            console.error("Error Data:", JSON.stringify(err.response.data, null, 2));
        } else {
            console.error("Error:", err.message);
        }
    }
};

test();
