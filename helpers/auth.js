//this will protect our routes from being accessed while not logged in

module.exports = {
    ensureAuthenticated: function(req, res, next){
        //if authenticated, continue with next function
        if(req.isAuthenticated()){
            return next();
        }

        //if not authenticated
        req.flash('errorMessage', 'Please login');
        res.redirect('/users/login');
    }
}