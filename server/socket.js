const express = require('express')
const socketIo = require('socket.io')
const http = require('http')
const PORT = process.env.PORT || 9009

const app = express()
const cors = require("cors");
const server = http.createServer(app)

const io = socketIo(server, {
    cors: {
        origin: '*'
    }
})
//in case server and client run on different urls



io.on('connection', (socket) => {
    console.log('New client connected');

    // Emit an event named "sent-msg2"
    socket.emit('sent-msg2', { message: 'server-test' });

    // Listen for an event named "on-msg2"
    // socket.on('on-msg2', (data) => {
    //     console.log(data);
    // });

    socket.on('test2', (data) => {
        console.log('server on = ', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

app.use(cors());
app.use(express.json());


// ----------get sw
app.get("/sent", (req, res) => {
    const result = "test sent";
    io.emit("test", result);
    return res.send({ result: true, msg: result });

});



server.listen(PORT, err => {
    if (err) console.log(err)
    console.log('Server running on Port ', PORT)
})