const userRole = require('../models/userRoles');
module.exports={
    isAdmin:(req,res,next)=>{
        if(req.isAuthenticated()){
            if(req.user.userRole===userRole.Admin){
                return next();
            }
            else{
                return res.redirect('/');
            }
        }
        else{
            return res.redirect('/');
        }
    },
    isLogin:(req,res,next)=>{
        if(req.isAuthenticated()){

                return next();

        }
        else{
            return res.redirect('/');
        }
    }
}
