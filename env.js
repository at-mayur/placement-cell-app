

// Variables for app
module.exports.production = {
    PORT: 8000,
    STATIC_CONTENT: "./static",
    views: "./static/views/",
    SESSION_KEY: "71C79ECDACF667AF5E55BA9D2E3BD",
    MONGO_URL: "mongodb://127.0.0.1:27017/placementCell",
    // secret pass and salt for creating cipher
    SECRET_PASS: "916BED12F6D492C8A4994E191E822",
    SALT: "T9TZEhqlV8"
}