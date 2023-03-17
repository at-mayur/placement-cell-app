// importing express
const express = require("express");

// importing ejs layouts
const ejsLayouts = require("express-ejs-layouts");

// importing environment variables
const prod = require("./env").production;

// importing routes
const Routes = require("./routes/index");

// Initiating app
const app = express();

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