const Employee = require("../models/employee");
const encrypt = require("../config/encryptPass");

// sign up page controller
module.exports.signUpController = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect("/");
    }

    return res.render("signup", {
        title: "Sign Up"
    });
};

// sign in page controller
module.exports.signInController = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect("/");
    }

    return res.render("signin", {
        title: "Sign In"
    });
};

// login action controller
module.exports.createSession = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect("/");
    }

    return res.redirect("back");
};

// new user creation action controller
module.exports.createUser = async function(req, res){
    
    try {
        // pass cnf pass does not match then return
        if(req.body.empPassword!==req.body.cnfPassword){
            console.log("password confirm password do not match");
            return res.redirect("back")
        }

        // find emp with email id
        let emp = await Employee.findOne({ emp_email: req.body.empMail });

        // if emp with given mail id does not exist
        if(!emp){
            
            let encryptPass = encrypt.getEncryptedData(req.body.empPassword);

            // create new user
            await Employee.create({
                emp_name: req.body.empName,
                emp_email: req.body.empMail,
                emp_password: encryptPass
            });
            // redirect to sign in page
            return res.redirect("/user/sign-in");
        }

        // if user already exists with given mail id then return
        console.log("User already exists with given mail id");
        return res.redirect("back");
    } catch (error) {
        console.error(error);
        // render error page on receiving error
        return res.render("error", {
            error: error
        });
    }

};

// sign out action controller
module.exports.signOutController = function(req, res){
    // func provided by passport. removes user from session
    req.logout(function(error){
        if(error){
            console.error(error);
            // if error render error page
            return res.render("error", {
                error: error
            });
        }

        return res.redirect("/");
    });
};