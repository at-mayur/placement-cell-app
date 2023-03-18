
// home controller to render home page i.e. student details page
module.exports.homeContorller = function(req, res){
    if(!req.isAuthenticated()){
        return res.redirect("/user/sign-in");
    }

    return res.render("students");
};