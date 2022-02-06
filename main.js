require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const axios = require('axios');
const { Server } = require("socket.io");
const io = new Server(server);
const path = require('path');

const fetchData = () => {
    axios.get(process.env.API_URL).then((data) => {
        io.emit('api response', {
        latitude: data.data.latitude,
        longitude: data.data.longitude
    })}).catch((e) => {
        console.log(e)
    });
};

app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/', (req, res) => {  
    res.status(200)
    res.render('index.html')
});

io.on('connection', (socket) => {  
    console.log('New Socket Connection Stablished');
    setInterval(fetchData, 5000);
    socket.on('disconnect', () => {
        console.log('A Socket Connection Has Finished')
    })
});

server.listen(3000, () => {
    console.log('Server Up And Running On http://localhost:3000');
});