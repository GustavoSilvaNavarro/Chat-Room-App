//START CONNECTION USING OBJECT IO
const socket = io(); //se va a conectar al dominio en este caso al localhost y le debo dar la ruta donde se va a dar la coneccion en tiempo real / Genero mismo id en el servidor y en el frontend asi saben que es el mismo

//SOCKET EVENT USER CONNECTIONS - Receive it from server / CONNECT CLIENT (user)
socket.on('connect', () => {
    console.log('Connected to server!!!');
});

//SOCKET EVENT DISCONNECTION RECEIVE FROM SERVER / DISCONNECT CLIENT (user)
socket.on('disconnect', () => {
    console.log('Disconnecting to server!!!!');
});