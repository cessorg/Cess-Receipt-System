const express=require('express');
const router = express.Router();
const db = require("../models/index");
const passport = require("passport");
const userRole=require("../models/userRoles");
const middleware=require('../middleware/middleware');

router.get("/",middleware.isAdmin,(req,res)=>{
    db.User.find({userRole:userRole.Cashier})
    .then(cashiers=>{
      db.Event.find({})
      .then(events=>{
        res.render("admin/home",{cashiers:cashiers,events:events});
      })
      .catch(err=>{
        console.log(err.message);
      });
    })
    .catch(err=>{
      console.log(err.message);
      res.redirect('/');
    })
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

router.post("/cashierData",middleware.isAdmin,(req,res)=>{
  res.redirect('/admin/cashierDetails/'+req.body.cashier);
});

router.post("/eventData",middleware.isAdmin,(req,res)=>{
  res.redirect('/admin/eventDetails/'+req.body.event);
});

router.get('/cashierDetails/:id',middleware.isAdmin,(req,res)=>{
  db.Reciept.find({generatedBy:req.params.id})
    .populate("event")
    .then(reciepts=>{
      res.render('admin/cashierDetails',{reciepts});
    })
});

router.get('/eventDetails/:id',middleware.isAdmin,(req,res)=>{
  db.Reciept.find({event:req.params.id})
    .populate("generatedBy")
    .then(reciepts=>{
      res.render('admin/eventDetails',{reciepts});
    })
})

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
