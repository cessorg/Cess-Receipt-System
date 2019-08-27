const mongoose= require("mongoose");

const recieptSchema=new mongoose.Schema({
    event:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'event',
        required:true
    },
    teamLeaderName:{
        type:String,
        required:true
    },
    teamMembers:[{type:String}],
    teamLeaderEmail:{
        type:String,
        required:true
    },
    eventFee:Number,
    generatedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    expire:{
        type:Boolean,
        default:false
    }
});
module.exports=mongoose.model("reciept",recieptSchema);
