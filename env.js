const crypto = require("node:crypto");

// secret pass and salt for creating cipher
const secret_pass = "916BED12F6D492C8A4994E191E822";
const salt = "T9TZEhqlV8";

// creating a key from secret_pass/salt and length 24
const key = crypto.scryptSync(secret_pass, salt, 24);

// creating vector
let iv = Buffer.alloc(16, 0);

// creating cipher function
let my_cipher = crypto.createCipheriv("aes-192-cbc", key, iv);



// Variables for app
module.exports.production = {
    PORT: 8000,
    STATIC_CONTENT: "./static",
    views: "./static/views/",
    SESSION_KEY: "71C79ECDACF667AF5E55BA9D2E3BD",
    MONGO_URL: "mongodb://localhost:27017/placementCell",
    cipher: my_cipher,
}