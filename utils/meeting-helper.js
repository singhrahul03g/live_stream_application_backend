const meetingServices = require("../services/meeting.service");
const meetingPayloadEnum = require("./meeting-payload-enum");

async function joinMeeting(meetingId, socket, meetingServer,payload){

const {userId, name} =  payload.data
meetingServices.isMeetingPresent(meetingId, async (error, results)=>{

if(error && !results){

sendMessage(socket, {
type:meetingPayloadEnum.NOT_FOUND
})

}

if(results){

addUser(socket,{meetingId,userId,name}).then((result)=>{

if(result){

    sendMessage(socket, {type:meetingPayloadEnum.JOINED_MEETING, data:{
    userId
    }}
    )

    console.log(payload,"----")

    broadcastUsers(meetingId,socket,socketServer,{
    type:MeetingPayloadEnum.USER_JOINED,
    data:{
    userId,
    name,
    ...payload.data
    }

    })

}}, (error)=>{
console.log(error);
}


)

}



})

}


function forwardConnectionRequest(meetingId, server, meeting, payload){
const {userId, otherUserId, name } = payload.data;

var model = {
meetingId:meetingId,
userId:otherUserId
}

meetingServices.getMeetingUser(model,( error,results)=>{
    if(results){
        var sendPayload = JSON.stringify({
    type:MeetingPayloadEnum.CONNECTION_REQUEST,
    data:{
    userId,
    name,
    ...payload.data
    }
 })

 meetingServer.to(results.socketId).emit("message", sendPayload);



    }
})

}

function forwardIceCandidate(meetingId, server, meeting, payload){
const {userId, otherUserId, candidate } = payload.data;

var model = {
meetingId:meetingId,
userId:otherUserId
}

meetingServices.getMeetingUser(model,( error,results)=>{
    if(results){
        var sendPayload = JSON.stringify({

    type:MeetingPayloadEnum.ICECANDIDATE,
    data:{
    userId,
    name,
    ...payload.data
    }

 })

 meetingServer.to(results.socketId).emit("message", sendPayload);



    }
})

}


function forwardOfferSDP(meetingId, server, meeting, payload){
const {userId, otherUserId, sdp } = payload.data;

var model = {
meetingId:meetingId,
userId:otherUserId
}

meetingServices.getMeetingUser(model,( error,results)=>{
    if(results){
        var sendPayload = JSON.stringify({

    type:MeetingPayloadEnum.OFFER_SDP,
    data:{
    userId,
sdp
    }

 })

 meetingServer.to(results.socketId).emit("message", sendPayload);



    }
})

}


function forwardANSWERSDP(meetingId, server, meeting, payload){
const {userId, otherUserId, sdp } = payload.data;

var model = {
meetingId:meetingId,
userId:otherUserId
}

meetingServices.getMeetingUser(model,( error,results)=>{
    if(results){
        var sendPayload = JSON.stringify({

    type:MeetingPayloadEnum.ANSWER_SDP,
    data:{
    userId,
sdp
    }

 })

 meetingServer.to(results.socketId).emit("message", sendPayload);



    }
})

}

function userLEFT(meetingId, socket, meetingServer, payload){
const {userId } = payload.data;

broadcastUsers(meetingId,socket,meetingServer,{
type:MeetingPayloadEnum.USER_LEFT,
data:{
userId}



})


}


function endMeeting(meetingId, socket, meetingServer, payload){
const {userId } = payload.data;

broadcastUsers(meetingId,socket,meetingServer,{
type:MeetingPayloadEnum.MEETING_ENDED,
data:{
userId}



})

meetingServices.getAllMeetingUsers(meetingId,(error,results)=>{
    for(let i = 0; i < results.length; i++){
const meetingUser = results[i];
meetingServer.sockets.connected[meetingUser.socketId].disconnect()
    }
})

}

function forwardEvent(meetingId, socket, meetingServer, payload){
const {userId } = payload.data;

broadcastUsers(meetingId,socket,meetingServer,{
type:payload.type,
data:{
userId,
...payload.data
}



})

meetingServices.getAllMeetingUsers(meetingId,(error,results)=>{
    for(let i = 0; i < results.length; i++){
const meetingUser = results[i];
meetingServer.sockets.connected[meetingUser.socketId].disconnect()
    }
})

}



function addUser(socket,{meetingId,userId,name}){
    let promise = new Promise(function (resolve,reject){
    meetingServices.getMeetingUser({meetingId, userId}, (error,results)=>{

    if(!results){
    var model = {
    socketId:socket.id,
    meetingId:meetingId,
    userId:userId,
    joined:true,
    name:name,
    isAlive:true
    };

    meetingServices.joinMeeting(model,(error,results)=>{

    if(results){
    resolve(true);
    }
    if(error){
    reject(error);
    }

    })

    }

    meetingServices.updateMeetingUser({
    userId:userId,
    socketId:socket.id

    },(error,results)=>{
    if(results){
    resolve(true)
    }
    if(error){
    reject(error)
    }

    }



    )


    })
    })





}

async function sendMessage(socket, payload){
    socket.send(JSON.stringify(payload))
}

 function broadcastUsers(meetingId, socket, meetingServer, payload){
    socket.broadcast.emit("message", JSON.stringify(payload));
 }

 module.exports = {
 joinMeeting,
 forwardConnectionRequest,
 forwardIceCandidate,
 forwardANSWERSDP,
 forwardOfferSDP,
 userLEFT,
 endMeeting,
 forwardEvent
 }




