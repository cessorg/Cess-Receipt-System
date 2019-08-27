const express=require('express');
const router = express.Router();
const db = require("../models/index");
const passport = require("passport");
const userRole=require("../models/userRoles");
const middleware=require('../middleware/middleware');

router.get("/",middleware.isAdmin,(req,res)=>{
    res.render("admin/home");
});

router.post("/register",middleware.isAdmin,(req,res)=>{
    const newUser={
        username:req.body.username,
        userRole:userRole.Cashier
    };
    db.User.register( new db.User(newUser),req.body.password,(err,user)=>{
        if(err){
            console.log(err);


        }
        else{
            console.log(user);

        }
        res.redirect("/admin");
    });

});
router.get("/events",middleware.isAdmin,(req,res)=>{
    db.Event.find()
    .then(eve=>{
        res.render("admin/event.ejs",{allEvents:eve});
    })
    .catch(err=>{
        console.log(err);
        res.redirect("/admin");
    });
})
router.post("/event",middleware.isAdmin,(req,res)=>{
    const newEvent={eName:req.body.name,eDate:req.body.date};
    db.Event.create(newEvent)
    .then(event=>{
        console.log(event);
        res.redirect("/admin/events");
    })
    .catch(err=>{
        console.log(err);
        res.send(err);
    });


});

module.exports=router;
