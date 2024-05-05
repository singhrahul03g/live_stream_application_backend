
const meetingServices = require('../services/meeting.service')

const startMeeting =(req,res,next)=>{

const{hostId,hostName} = req.body;
var model = {
hostId:hostId,
hostName:hostName,
startTime:Date.now()

};

meetingServices.startMeeting(model, (error, results)=>{
if(error){
return next(error);
}else{

return res.status(200).send({
message:"success",
data:results.id
})
}
})
}

const checkMeetingExists = (req,res,next)=>{
    const {meeting} = req.query;

    meetingServices.checkMeetingExists(meetingId, (error,results)=>{

    if(error){
    return next(error);
    }
    return res.status(200).send({
    message:"success",
    data:results
    })

    })

}


const getAllMeetingUsers = (req,res,next) => {

const meetingId = req.query;
meetingServices.getAllMeetingUsers(meetingId, (error, results)=>{

if(error){
return next(error);
}
res.status(200).send({

message:"success",
data:results

})
})

}

module.exports = {
checkMeetingExists,
startMeeting,
getAllMeetingUsers
}
