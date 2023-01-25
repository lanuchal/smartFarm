const express = require('express')
const http = require('http')
const PORT = process.env.PORT || 9010
const app = express()
const cors = require("cors");
const server = http.createServer(app)

const socket = require('socket.io-client')('http://203.159.93.65:9009');


app.use(cors());
app.use(express.json());


socket.on('connect', () => {
    console.log("Connected to the server");
});

socket.on('sent-msg2', (data) => {
    console.log("Received message: ", data);
});

socket.on('test', (data) => {
    console.log("Received test message: ", data);
});


socket.on('disconnect', () => {
    console.log("Disconnected from the server");
});

// ----------get sw
app.get("/sent2", (req, res) => {
    const result = "client-test sent2";
    socket.emit('test2', { message: result });
    return res.send({ result: true, msg: result });

});



server.listen(PORT, err => {
    if (err) console.log(err)
    console.log('Server running on Port ', PORT)
})