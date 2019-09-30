var mongoose=require("mongoose");
mongoose.set("debug",true);
mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.DATABASEURL||"mongodb://localhost/cessRecieptDB",{useNewUrlParser:true});

mongoose.Promise=Promise;
module.exports.User=require("./user.js");
module.exports.Event=require("./event");
module.exports.Reciept=require("./reciept");
