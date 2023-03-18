const Employee = require("../models/employee");
const prod = require("../env").production;

// sign up page controller
module.exports.signUpController = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect("/");
    }

    return res.render("signup");
};

// sign in page controller
module.exports.signInController = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect("/");
    }

    return res.render("signin");
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
            // create encrypted password for our user
            let my_cipher = prod.cipher;
            let encryptPass = "";
            // action to be done on new string found
            my_cipher.on("readable", () => {
                let chunk = my_cipher.read();
                while(chunk!=null){
                    encryptPass += chunk.toString("hex");
                    chunk = my_cipher.read();
                }
            });

            // initiate encryption of our pass string
            my_cipher.write(req.body.empPassword);
            // end event
            my_cipher.end();

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

        return res.redirect("/user/sign-in");
    });
};