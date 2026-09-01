const mongoose = require("mongoose");
const app = require("./app");


mongoose
    .connect(process.env.MONGO_URI)
    .then(()=>{console.log("Connected to Mongodb")})
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.error(error);
    });