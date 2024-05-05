const meeting = require("../models/meeting.model.js");
const meetingUser = require("../models/meeting-user-model.js");


async function getAllMeetingUsers(meetId, callback){
    meetingUser.find({meetingId:meetId}).then((response)=>{
    return callback(null,response);
    }).catch((error)=>{
     return callback(error);
    })
}


async function joinMeeting(params, callback){
    const meetingUserModel = new meetingUser(params);
    meetingUserModel.save().then(
    async (response)=>{

    await meeting.findOneANdUpdate({id:params.meetingId},
    {$addToset:{"meetingUsers":meetingUserModel}}
    );

return callback(null,response);
    }
    )
    .catch(
    (error) =>{
    return callback(error);
    }
    )

}

async function startMeeting(params,callback){
    const meetingSchema = new meetingUser(params);
    meetingSchema.save().then((response)=>{
    return callback(null, response)
    }).catch((error)=>{
    return callback(error)})
}

async function isMeetingPresent(meetingId,callback){

    meeting.findById(meetingId)
    .populate("meetingUsers","meetingUser")
    .then((response)=>{
    if(!response){
    callback(" Invalid meeting Id");
    }
     else{
        callback(null, true);
        }

    }


    ).catch(
    (error)=>{ return callback(error,false);}
    )

}

async function checkMeetingExists(meetingId,callback){

meeting.findById(meetingId, "hostId", "hostName", "startTime").populate("meetingUsers","meetingUser").then((response)=>{

if(!response)  callback("invalid meeting Id")
else callback(null, response)

}).catch(error=>{
    return callback(error, false)
})

}

async function getMeetingUser(params, callback){
const {meetingId, userId} = params;
meetingUser.find({meetingId, userId}).then((response)=>{
return callback(null, response[0])}).catch(error=> callback(error));

}

async function updateMeetingUser(params, callback){
    meetingUser.updateOne({userId: params.userId},{$set:params},{new:true})
    .then(response=>callback(null,response))
    .catch(error=> callback(error))
}

async function getUserBySocketId(params, user){

    const {meetingId, socketId} = params

    meetingUser.find({meetingId,socketId})
    .limit(1)
    .then(response=> callback(null, response))
.catch(error=> callback(error))

}

module.exports = {

startMeeting,
joinMeeting,
getAllMeetingUsers,
isMeetingPresent,
checkMeetingExists,
getUserBySocketId,
updateMeetingUser,
getMeetingUser
};



