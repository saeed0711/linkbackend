const mongoose=require("mongoose");

const urlschema=new mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true
    },
    ip:{
        type:String,
        require:true
    },
    url:{
        type:String,
        require:true
    },
    short:{
        type:String,
        require:true,
        
    },
    shorturl:{
        type:String,
        require:true,
        
    },
    // count:{
    //     type:Number,
    //     required:true
    // },
    check:{
        type:String,
        // default:false
    },

    summery:{
        type:String
    },
    expdate:{
        type:Date
    },
    devices:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    }

})

const urlmodel=mongoose.model("URL",urlschema)

module.exports=urlmodel;