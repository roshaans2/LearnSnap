const mongoose = require("mongoose")

const LearnSnapSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
}) 

const LearnSnap = mongoose.model("LearnSnap",LearnSnapSchema)

module.exports = LearnSnap