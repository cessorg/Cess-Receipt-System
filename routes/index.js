const express=require('express');
const router = express.Router();
const db = require("../models/index");
const passport = require("passport");
const userRole=require("../models/userRoles");
const middleware=require('../middleware/middleware');
const mailFunction=require("../mail");
const QRCode = require('qrcode');
const ejs=require("ejs");

router.get("/",(req,res)=>{
    res.render("index");
});

router.get("/mailhtml",(req,res)=>{
  res.render("mail");
})
router.get('/scanqr',middleware.isLogin,(req,res)=>{
  res.render("checkRegistration.ejs");
});

router.post('/scanqr',middleware.isLogin,(req,res)=>{
    console.log("scanqr post route");
    res.redirect('/team-details/'+req.body.id);
});

router.post('/leaderEmail',middleware.isLogin,(req,res)=>{
    db.Reciept.findOne({teamLeaderEmail:req.body.email,expire:false})
    .then(data=>{
      if(!data)
        res.redirect('/team-details/noRecord');
      else
        res.redirect('/team-details/'+data._id);
    });
});

router.get('/team-details/:id',middleware.isLogin,(req,res)=>{
  if(req.params.id == "noRecord")
  {
    let data ={};
    data.isValid = false;
    res.render("userDetails",{data:data});
  }
  db.Reciept.findById(req.params.id)
    .then(data=>{
      if(!data.expire){
        data.isValid = true;
      }else{
        data.isValid = false;
      }
      res.render("userDetails",{data:data});
    })
    .catch(err=>{
      data = {};
      data.isValid = false;
      res.render("userDetails",{data:data});
    });
})

router.get('/lock-user/:id',middleware.isLogin,(req,res)=>{
  db.Reciept.findById(req.params.id)
    .then(reciept=>{
      reciept.expire = true;
      reciept.save();
    })
    .catch(err=>{
      console.log(err.message);
    })
    res.redirect('/scanqr');
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
  db.Reciept.find({generatedBy:req.user._id})
  .populate("event")
  .then(foundReciepts=>{
    res.render("cashier",{reciepts:foundReciepts});
  })
  .catch(err=>{
    console.log(err);
    res.redirect("/");
  });

});

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
        newReciept.teamMembers.push(req.body["member"+(i+1)]);
    }
    db.Reciept.create(newReciept)
    .then(createdReciept=>{
        console.log(createdReciept);
        db.Event.findById(createdReciept.event)
        .then(event=>{

          QRCode.toDataURL(createdReciept._id.toString(), function (err, url) {
              var htmlString="";
              ejs.renderFile(__dirname+"/../views/mail.ejs",{
                reciept:{
                  leaderName:createdReciept.teamLeaderName,
                  eventFee:createdReciept.eventFee
                },
                eName:event.eName
              },(err,data)=>{
                if(err){

                  console.log(err);
                }else{

                  htmlString=data;
                }
              });

            const mailOptions = {
                from: '"CESS " <manjotsingh16july@gmail.com>', // sender address (who sends)
                to: createdReciept.teamLeaderEmail, // list of receivers (who receives)
                subject: `You registered Successfully `, // Subject line
                html: htmlString,
                attachments:[{
                    filename:"QRcode.jpg",
                    content: new Buffer(url.split("base64,")[1],"base64")
                }]
              };
              mailFunction(mailOptions);
            res.redirect("/reciept");
          });
        })
        .catch(err=>{
          console.log(err);
          res.redirect("/reciept");
        });
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
