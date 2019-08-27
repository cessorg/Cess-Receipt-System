const   express=require("express"),
        passport = require('passport'),
        localStrategy = require('passport-local'),
        passportLocalMongoose = require('passport-local-mongoose'),
        adminRoutes = require("./routes/admin"),
        indexRoutes = require("./routes/index"),
        bodyParser=require('body-parser'),
        db = require('./models/index'),
        session = require('express-session');
const app=express();

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

app.use("/admin",adminRoutes);

app.use("/", indexRoutes);


app.listen(8000,()=>{
    console.log("Server Worked on port 8000");
})