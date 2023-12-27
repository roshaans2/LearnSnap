const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")
const Schema = mongoose.Schema

const userSchema = Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    snaps:[
        {
            type:Schema.Types.ObjectId,
            ref:'LearnSnap'
        }
    ]
})
userSchema.plugin(passportLocalMongoose)
const User = mongoose.model("User",userSchema)

module.exports = User