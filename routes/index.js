const express=require('express');
const router = express.Router();
const db = require("../models/index");
const passport = require("passport");
const userRole=require("../models/userRoles");
const middleware=require('../middleware/middleware');
const mailFunction=require("../mail");

router.get("/",(req,res)=>{
    
    res.render("index");
});
router.post("/login",passport.authenticate("local",{
    failureRedirect:"/"
}),(req,res)=>{
    switch(req.user.userRole){
        case userRole.Admin : res.redirect("/admin");break;
        case userRole.Cashier: res.redirect("/cashier");break;
    }
    
});
router.get("/cashier",middleware.isLogin,(req,res)=>{
    res.render("cashier");
})
router.get("/reciept",middleware.isLogin,(req,res)=>{
    const today=new Date();
    db.Event.find({eDate:{$gte:today}})
    .then(foundEvents=>{
        res.render("reciept",{events:foundEvents});
    })
    .catch(err=>{
        console.log(err);
        res.redirect("/");
    })
});
router.post("/reciept",middleware.isLogin,(req,res)=>{
    const newReciept={
        event:req.body.event,
        teamLeaderName:req.body.leaderName,
        teamLeaderEmail:req.body.leaderEmail,
        eventFee:req.body.eventFee,
        generatedBy:req.user._id,
        teamMembers:[]
    }
    for(var i=1;i<req.body.memberCount;i++){
        newReciept.teamMembers.push(req.body["member"+i+1]);
    }
    db.Reciept.create(newReciept)
    .then(createdReciept=>{
        console.log(createdReciept);
        const mailOptions = {
            from: '"CESS " <manjotsingh16july@gmail.com>', // sender address (who sends)
            to: createdReciept.teamLeaderEmail, // list of receivers (who receives)
            subject: `You registered Successfully `, // Subject line
            text: `Thank You for participating in This event. We Believe You will put your best to win it.`     
          };
          mailFunction(mailOptions);
        res.redirect("/reciept");
    })
    .catch(err=>{
        console.log(err);
        res.redirect("/reciept");
    })
    
})
router.get("/logout",(req,res)=>{
    req.logout();
    res.redirect("/");
})

module.exports=router;