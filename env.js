

// Variables for app
module.exports.production = {
    PORT: 8000,
    STATIC_CONTENT: "./static",
    views: "./static/views/",
    SESSION_KEY: "",// Key of your choice
    MONGO_URL: "mongodb://127.0.0.1:27017/placementCell",
    // secret pass and salt for creating cipher
    SECRET_PASS: "",// password of your choice
    SALT: ""// secret of your choice
}
