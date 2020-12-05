//ENVIROMENT VARIBLES CONFIRMATION

//CALL MODULES AND METHODS
const express = require('express');
const path = require('path');
const socketIo = require('socket.io');
const { generateMessage, generateLocationMessage } = require('./utils/message');
const { validateName } = require('./utils/validation-name');
const { User } = require('./utils/users');
const user = new User(); //HAGO LLAMADO DE LA CLASE

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

    //RECEIVING SOCKET EVENT FROM CLIENT - ROOM CHATS
    socket.on('join-room', (params, callback) => { // EL RETURN ES PARA QUE CORTE Y NO SIGA
        if (!validateName(params.name) || !validateName(params.room)) { //EN CASO SEA VERDAD ES DECIR SI ESCRIBIN EN BLANCO Y NO HAY NOMBRE DEL ROOM O DEL USARIO MANDA ERROR
            return callback('Name and Room are Required!!!!'); //es la funcion que define en mi dom como callback para que haga algo cuando se de el evento socket / INLCUSO EN ESTE CALLBACK PUEDO ENVIAR DATOS AL CLIENTE
        } else { //si todo va bien y si hay nombre pasa el mensaje

            socket.join(params.room); //LE DIGO A QUE ROOM ME QUIERO UNIR / LE PASO LA INFO DEL ROOM A LA QUE EL USUARIO SE ESTA UNIENDO
            user.removeUser(socket.id); //DEBERIA CHEQUEAR SI EL USUARIO ESTA EN OTRO ROOM PERO COMO NO QUIERO HACERLO SIMPLEMENTE LO SACO DE SU ROOM ACTUAL EN CASO ESTE PARA LUEGO METERLO EN EL ROOM QUE QUIERO
            user.addUser(socket.id, params.name, params.room); //creo mi objeto de usuario

            io.to(params.room).emit('update-user-list', user.getUserList(params.room)); //EMITO LISTA DE NOMBRES AL FRONTEND

            //SENDING EVENT TO THE CLIENTE - WELCOME TO THE CHAT
            //Por ser socket emit solo le aparece al cliente que genero el evento, en este caso cuando se conecte le aparece el evento pero a los demas conectados ya no ya que ya les salio antes no se le va a repetir
            socket.emit('new-message', generateMessage('Admin', `Welcome to ${params.room}!`)); // for everyone who connects

            //SENDING EVENT TO THE CLIENT - MESSAGE WHEN YOU CONNECT / ESTE CAMBIA DENTRO DE UN ROOM A SU FORMA ANTERIOR
            socket.broadcast.to(params.room).emit('new-message', generateMessage('Admin', 'New user Joined!')); //FOR EVERYBODY EXCEPT OF THE NEW CLIENT
            
            callback(); //MANDO EL CALLBACK VACIO INDICANDO QUE NO HAY ERROR
        }
    });

    //RECEIVING EVENT FROM CLIENT - CHAT MESSAGES
    socket.on('create-messages', (message, callback) => {
        const specificUser = user.getUser(socket.id); //OBTENGO MI USUARIO

        if (specificUser && validateName(message.text)) { //VLIDO SI EXISTE USUARIO Y SI ES VALIDO
            io.to(specificUser.room).emit('new-message', generateMessage(specificUser.name, message.text)); //SEND TO EVERYONE INCLUDE THE CLIENT WHO SENT
        }
        callback('From the server:'); //es la funcion que define en mi dom como callback para que haga algo cuando se de el evento socket / INLCUSO EN ESTE CALLBACK PUEDO ENVIAR DATOS AL CLIENTE
    });

    //RECEIVING DATA FROM CLIENT - LOCATION DATA MESSAGE
    socket.on('createLocationMessage', coords => {
        const usuario = user.getUser(socket.id); //OBTENGO MI USUARIO

        if (usuario) { //VALIDO EL USUARIO ENCONTRADO
            io.to(usuario.room).emit('newLocationMessage', generateLocationMessage(usuario.name, coords.lat, coords.long)); //SEND TO EVERYONE INCLUDE THE CLIENT WHO SENT
        }
    });

    //Disconnection
    socket.on('disconnect', () => {
        console.log('User was disconnected!!');
        const usuario = user.removeUser(socket.id); //PARA EVITAR QUE CUANDO ACTUALICE LA PAGINA ESTE INGRESE MAS USUARIOS CON EL MISMO NOMBRE REMOVERE EL USUARIOC UANDO SE DESCONECTE
        console.log(usuario);
        if (usuario) { //SI EL USUARIO A REMOVER EXISTE
            io.to(usuario.room).emit('update-user-list', user.getUserList(usuario.room)); //ACTUALIZO LA LISTA
            io.to(usuario.room).emit('new-message', generateMessage('Admin', `${usuario.name} has left ${usuario.room} chat room!`));
        }
    });
});

//SERVER
server.listen(app.get('port'), () => {
    console.log('Server on Port.....', app.get('port'));
});