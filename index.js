const express = require("express");
const app = express();
const mongoose = require("mongoose");
const {MONGO_DB_CONFIG} = require("./config/app.config.js");
const http = require("http");
const server = http.createServer(app);

const {initMeetingServer} = require("./meeting-server");
initMeetingServer(server)

mongoose.Promise = global.Promise
mongoose.connect(MONGO_DB_CONFIG.DB,{
useNewUrlParser:true,
useUnifiedTopology:true
}).then(()=>{
console.log("database connected")
}).catch((error)=>{

console.log("database can't be connected")

})

app.use(express.json());
app.use("/api", require("./routes/app.routes"));

server.listen(process.env.port || 4000 , function(){
console.log("Ready to Go!")
})




