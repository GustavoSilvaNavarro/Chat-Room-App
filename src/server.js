//ENVIROMENT VARIBLES CONFIRMATION

//CALL MODULES AND METHODS
const express = require('express');
const path = require('path');
const socketIo = require('socket.io');

//INITIALIZATIONS
const app = express();
const server = require('http').createServer(app);
const io = socketIo(server);

//SETTINGS
app.set('port', process.env.PORT || 3000);

//MIDDLEWARES

//GLOBAL VARIABLES

//ROUTES

//STATIC FILES
app.use(express.static(path.join(__dirname, 'public')));

//WEB SOCKETS
io.on('connection', socket => {
    console.log('New Connection!!', socket.id);

    //Disconnection
    socket.on('disconnect', () => {
        console.log('User was disconnected!!');
    });
});

//SERVER
server.listen(app.get('port'), () => {
    console.log('Server on Port.....', app.get('port'));
});