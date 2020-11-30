//ENVIROMENT VARIBLES CONFIRMATION

//CALL MODULES AND METHODS
const express = require('express');
const path = require('path');
const socketIo = require('socket.io');
const { generateMessage, generateLocationMessage } = require('./utils/message');

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

    //SENDING EVENT TO THE CLIENTE - WELCOME TO THE CHAT
    //Por ser socket emit solo le aparece al cliente que genero el evento, en este caso cuando se conecte le aparece el evento pero a los demas conectados ya no ya que ya les salio antes no se le va a repetir
    socket.emit('new-message', generateMessage('Admin', 'Welcome to the chat app!')); // for everyone who connects

    //SENDING EVENT TO THE CLIENT - MESSAGE WHEN YOU CONNECT
    socket.broadcast.emit('new-message', generateMessage('Admin', 'New user Joined!')); //FOR EVERYBODY EXCEPT OF THE NEW CLIENT

    //RECEIVING EVENT FROM CLIENT - CHAT MESSAGES
    socket.on('create-messages', (message, callback) => {
        io.emit('new-message', generateMessage(message.from, message.text)); //SEND TO EVERYONE INCLUDE THE CLIENT WHO SENT
        callback('From the server:'); //es la funcion que define en mi dom como callback para que haga algo cuando se de el evento socket / INLCUSO EN ESTE CALLBACK PUEDO ENVIAR DATOS AL CLIENTE
    });

    //RECEIVING DATA FROM CLIENT - LOCATION DATA MESSAGE
    socket.on('createLocationMessage', coords => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.lat, coords.long)); //SEND TO EVERYONE INCLUDE THE CLIENT WHO SENT
    });

    //Disconnection
    socket.on('disconnect', () => {
        console.log('User was disconnected!!');
    });
});

//SERVER
server.listen(app.get('port'), () => {
    console.log('Server on Port.....', app.get('port'));
});