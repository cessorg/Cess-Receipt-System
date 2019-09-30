const   express=require("express"),
        passport = require('passport'),
        localStrategy = require('passport-local'),
        passportLocalMongoose = require('passport-local-mongoose'),
        adminRoutes = require("./routes/admin"),
        indexRoutes = require("./routes/index"),
        bodyParser=require('body-parser'),
        db = require('./models/index'),
        session = require('express-session');
var json2xls = require('json2xls');
const app=express();
app.use(json2xls.middleware);

//Express session
app.use(session({
    secret:"Dogs are cute",
    resave:false,
    saveUninitialized:false
}));

//passport Auth setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(db.User.authenticate()));
passport.serializeUser(db.User.serializeUser());
passport.deserializeUser(db.User.deserializeUser());

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));

app.set("view engine", "ejs");
app.use(function(req,res,next){

    res.locals.curUser=req.user;
    res.locals.curUserRole=req.user?req.user.userRole:undefined;

    next();
});
app.get('/eventDetails/:id',(req,res)=>{
  db.Reciept.find({event:req.params.id})
    .then(reciepts=>{
      console.log(reciepts[0]);
      res.xls('data.xlsx', reciepts, {
        fields: ['teamLeaderName','teamLeaderEmail','teamMembers']
        });
    })
    .catch(err=>{
      console.log(err.message);
    })
})
app.use("/admin",adminRoutes);

app.use("/", indexRoutes);


app.listen(process.env.PORT||8000,()=>{
    console.log("Server Worked on port ",process.env.PORT||8000);
})
