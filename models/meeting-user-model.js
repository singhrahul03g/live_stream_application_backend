
const mongoose = require("mongoose")
const {Schema} = mongoose

const meetingUser = mongoose.model(
"MeetingUser",
new Schema({

socketId:{
type:String,
required:true
},

meetingId:{
//type:mongoose.Schema.types.ObjectId,
//ref:"Meeting"
},

userId:{
type:String,
required:true},
joined:{
type:Boolean,
required:true},
name:{
type:String,
required:true},
isAlive:{
type:String,
required:true},



}

//timestamps:true)


))

module.exports = {
    meetingUser
}