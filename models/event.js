const mongoose=require('mongoose');
const eventSchema=new mongoose.Schema({
    eName:String,
    eDate:Date
});

module.exports=mongoose.model("event",eventSchema);