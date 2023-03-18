
// interview controller to render interviews page
module.exports.interviewController = function(req, res){
    if(!req.isAuthenticated()){
        return res.redirect("/user/sign-in");
    }

    return res.render("interview");
};