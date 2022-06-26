const express = require('express')
const socketIo = require('socket.io')
const http = require('http')
const PORT = process.env.PORT || 9009
const mysql = require("mysql");
const app = express()
const cors = require("cors");
const server = http.createServer(app)
const io = socketIo(server, {
    cors: {
        origin: 'https://socket.anuchadev.com'
    }
}) //in case server and client run on different urls


io.on('connection', (socket) => {
    console.log('client connected: ', socket.id)

    socket.join('clock-room')

    socket.on('disconnect', (reason) => {
        console.log(reason)
    })
})


app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "128.199.162.10",
    user: "anucha",
    password: "kaoanucha425",
    database: "DEVICE_SW",
});
db.connect(function (err) {
    if (err) {
        return console.error("error: " + err.message);
    }
    console.log("Connected to the MySQL server.");
});


// ----------get sw
app.get("/getswdata", (req, res) => {
    db.query("SELECT * FROM `control_device`", (err, result) => {
        if (err) {
            return res.send({ result: "nok", err: err });
        } else {
            return res.send({ result: "ok", data: result });
        }
    });
});

app.get('/updatestatesw/:id/:swstate', function (req, res) {
    const id = req.params.id
    const swstate = req.params.swstate
    db.query(
        "UPDATE control_device SET  device_state = ? WHERE device_id =?",
        [swstate, id],
        (error, results, fields) => {
            if (error) throw error;
            let message = "";
            if (results.changedRows === 0) {
                message = "data not found or data are same";
                return res.send({ result: "nok", data: results, message: message });
            } else {
                message = "data sucsessfully update";
                //io.to('clock-room').emit('sw-state', { id: device_id, state: device_state })
                io.to('clock-room').emit('sw-state', { id: id, state: swstate })
                return res.send({ result: "ok", data: results, message: message, id: id, swstate: swstate });
            }
        }
    );
});

// update sw data
app.get('/updatdatasw/:id/:name/:on1/:off1/:on2/:off2', function (req, res) {
    const id = req.params.id
    const name = req.params.name
    const on1 = req.params.on1
    const off1 = req.params.off1
    const on2 = req.params.on2
    const off2 = req.params.off2
    db.query(
        "UPDATE control_device SET  device_name = ? , device_time_on1 = ?, device_time_off1 = ?,device_time_on2 = ?,device_time_off2 = ? WHERE device_id =?",
        [name, on1, off1, on2, off2, id],
        (error, results, fields) => {
            if (error) throw error;
            let message = "";
            if (results.changedRows === 0) {
                message = "data not found or data are same";
                return res.send({ result: "nok", data: results, message: message });
            } else {
                message = "data sucsessfully update";
                io.to('clock-room').emit('sw-data', {
                    id: id,
                    device_name: name,
                    device_time_on1: on1,
                    device_time_off1: off1,
                    device_time_on2: on2,
                    device_time_off2: off2
                })
                return res.send({
                    result: "ok",
                    data: results,
                    id: id,
                    device_name: name,
                    device_time_on1: on1,
                    device_time_off1: off1,
                    device_time_on2: on2,
                    device_time_off2: off2
                });
            }
        }
    );
});




////////////////////////////////////////////////
//////////////// TEMP && HUM ///////////////////

// ----------get temp && hum
app.get("/getrialdata", (req, res) => {
    db.query("SELECT * FROM `raildata`", (err, result) => {
        if (err) {
            return res.send({ result: "nok", err: err });
        } else {
            return res.send({ result: "ok", data: result });
        }
    });
});

// update rail data
app.get('/updatarialdata/:temp/:hum', function (req, res) {
    const temp = req.params.temp
    const hum = req.params.hum
    db.query(
        "UPDATE raildata SET raildata_tem = ? , raildata_hum = ?  WHERE raildata_id = 1",
        [temp, hum],
        (error, results, fields) => {
            if (error) throw error;
            let message = "";
            if (results.changedRows === 0) {
                message = "data not found or data are same";
                return res.send({ result: "nok", data: results, message: message });
            } else {
                message = "data sucsessfully update";
                io.to('clock-room').emit('data-rial', { tem: temp, hum: hum })
                return res.send({ result: "ok", data: results, temp: temp, hum: hum });
            }
        }
    );
});

////////////////////////////////////////////////
//////////// !!!END TEMP && HUM ////////////////



server.listen(PORT, err => {
    if (err) console.log(err)
    console.log('Server running on Port ', PORT)
})