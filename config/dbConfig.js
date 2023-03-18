const mongoose = require("mongoose");
const prod = require("../env").production;

// Connecting to db
mongoose.connect(prod.MONGO_URL)
.then(() => {
    console.log("Connected to DB...");
})
// Handling error while connection
.catch((error) => {
    console.error(error);
});

module.exports = mongoose.connection;