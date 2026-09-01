const mongoose = require("mongoose");
const app = require("./app");

const PORT = 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(()=>{console.log("Connected to Mongodb")})
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error(error);
    });