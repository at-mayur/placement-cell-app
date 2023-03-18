const passport = require("passport");
const passportLocal = require("passport-local").Strategy;

const Employee = require("../models/employee");

const prod = require("../env").production;

// Initiating passport with new local strategy
passport.use(new passportLocal({
    // declaring username & Password fields
    // Similar to login form
    usernameField: "empMail",
    passwordField: "empPassword"
}, async function(username, password, done){
    try {
        // find emp with given mail id
        let emp = await Employee.findOne({ emp_email: username });

        // if not exist then return error null & emp false
        if(!emp){
            return done(null, false);
        }

        // get cipher function
        let my_cipher = prod.cipher;
        let encryptPass = "";

        // store encrypted password in variable
        my_cipher.on("readable", () => {
            let chunk = my_cipher.read();
            while(chunk!=null){
                encryptPass += chunk.toString("hex");
                chunk = my_cipher.read();
            }
        });

        // initiate cipher func to encrypt pass
        my_cipher.write(password);
        // after it call end event
        my_cipher.end();

        // if encrypted pass and password from db does not matches then return false
        if(emp.emp_password!=encryptPass){
            return done(null, false);
        }

        // otherwise return emp
        emp.emp_password = "";
        return done(null, emp);

    } catch (error) {
        console.error(error);
        return;
    }
    
}));

// Serializing emp i.e. telling passport to store only certain field of user data to cookie
passport.serializeUser(function(user, done){
    return done(null, user.id);
});

// Deserialize emp
// i.e. fetch all user details from user id that we have stored while serializing
passport.deserializeUser(async function(userId, done){

    try {

        let emp = await Employee.findById(userId);

        if(!emp){
            return done(null, false);
        }

        emp.emp_password = "";
        return done(null, emp);
        
    } catch (error) {
        console.error(error);
        return;
    }

});

// Creating a middleware to check authentication
passport.checkAuthentication = function(request, response, next){
    // if authenticated request then executing next step
    if(request.isAuthenticated()){
        return next();
    }

    // if not authenticated request then back to sign in page
    return response.redirect("/user/sign-in");
}

// midlleware to pass authenticated user to response.locals
passport.setAuthenticatedUser = function(request, response, next){
    if(request.isAuthenticated()){
        response.locals.user = request.user;
    }

    return next();
}


module.exports = passport;