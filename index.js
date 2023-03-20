// importing express
const express = require("express");

// DB import
const dbConnection = require("./config/dbConfig");

// importing ejs layouts
const ejsLayouts = require("express-ejs-layouts");

// import express session & connect-mongo to store session in db
const expSession = require("express-session");
const MongoStore = require("connect-mongo");

// importing passport for authentication
const passport = require("passport");
// local strategy
const passportLocal = require("./config/passportLocal");

// importing environment variables
const prod = require("./env").production;

// importing routes
const Routes = require("./routes/index");

// Initiating app
const app = express();

// decalring app to use middleware to extract form data
app.use(express.urlencoded());

// decalring app to use middleware to extract raw data
app.use(express.json());

// Declaring static content path
app.use(express.static(prod.STATIC_CONTENT));

// setting ejs as view engine & view path
app.set("view engine", "ejs");
app.set("views", prod.views);

// declaring ejs layouts as middleware
app.use(ejsLayouts);

// setting extract styles and scripts for layouts
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// Seeting up express session to use passport
app.use(expSession({
    name: "authenticatedUser",
    secret: prod.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000*60*10
    },
    store: MongoStore.create({
        mongoUrl: prod.MONGO_URL,
        stringify: false
    })
}));

// Initiating passport as middleware
app.use(passport.initialize());
app.use(passport.session());

// middleware to add user to response locals
app.use(passport.setAuthenticatedUser);

// directing all routes to route file
app.use("/", Routes);

// making app to listen at port
app.listen(prod.PORT, (error) => {
    if(error){
        console.error(error);
        return;
    }

    console.log("Server running on Port", prod.PORT);

});