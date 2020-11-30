//START CONNECTION USING OBJECT IO
const socket = io(); //se va a conectar al dominio en este caso al localhost y le debo dar la ruta donde se va a dar la coneccion en tiempo real / Genero mismo id en el servidor y en el frontend asi saben que es el mismo

//DOM VARIABLES
const btn = document.querySelector('#btn');
const userMessage = document.querySelector('input[name="message"]'); //DE ESTA FORMA LLAMO CON ETIQUETAS NAME
const geoLocatBtn = document.querySelector('#send-location');

//SOCKET EVENT USER CONNECTIONS - Receive it from server / CONNECT CLIENT (user)
socket.on('connect', () => {
    console.log('Connected to server!!!');
});

//SOCKET EVENT DISCONNECTION RECEIVE FROM SERVER / DISCONNECT CLIENT (user)
socket.on('disconnect', () => {
    console.log('Disconnecting to server!!!!');
});

//SOCKET RECEIVING EVEMT FROM SERVER - CHAT MESSAGES
socket.on('new-message', message => {
    const formatedTime = moment(message.createdAt).format('LT'); // LE DOY FORMATO A MI FECHA Y HORA PARA QUE LUZCA BIEN
    const template = document.querySelector('#message-template').innerHTML; // SELECCIONO EL HTML DENTRO DEL SCRIPT QUE PUSE
    const html = Mustache.render(template, {
        from: message.from,
        text: message.text,
        createdAt: formatedTime
    }); //RENDERIZO EL SCRIPT CON MUSTACHE

    const div = document.createElement('div'); //CREO ELEMETNO DIV
    div.innerHTML = html; //AÑADO EL HTML DEL SCRIPT AL DIV

    document.querySelector('#messages').appendChild(div); //COMO ESTOY RENDERIZANDO HTML NO DEBO PONER APPENCHILD SINO APPEND
});

//EVENT TO SEND DATA TO THE SERVER - CHAT MESSAGES
btn.addEventListener('click', (e) => {
    //SOCKET SENDING EVENT TO THE SERVER - CHAT MESSAGES
    socket.emit('create-messages', {
        from: 'User',
        text: userMessage.value
    }, message => { // COLOCO UN CALLBACK
        console.log(message, 'Got it!'); // LO BUENO DEL ACKNOWLEDGE ES QUE ES VICEVERSA PUEDO ENVIAR EL CALLBACK DESDE EL CLIENTE LE ENVIO LA ACCION O DESDE EL SERVIDOR LE ENVIO ALGUN DATO
    }); //VAMOS A HACER ALGO DE ACKNOWLEDGE QUE CONCISTE EN RETORNA UNA FUNCION O QUE EJECUTE ALGO CUANDO SE DE EL EVENTO DEL SOCKET O SE DE LA COMUNICACION DEL EVENTO, ALGUNOS CASOS PUEDO COLOCARLO PARA CONOCER SI AH PASADO ALGUN ERROR

    e.preventDefault(); //PARA EVITAR QUE FORMULARIO REINICIE
});

//GEOLOCATION API LOGIC AND WEBSOCKET
geoLocatBtn.addEventListener('click', () => {
    //TEST IF I HAVE THE GEOLOCATION OBJECT
    if(!navigator.geolocation) {
        return alert('Geolocation is not availabel');
    } else {
        navigator.geolocation.getCurrentPosition(position => { //FIRST FUNCTION TO SEE AND SHARE MY LOCATION
            //SOCKET SENDING EVENT TO THE SERVER - SENDING THE LOCATION OF THE CLIENT WHO SENT
            socket.emit('createLocationMessage', {
                lat: position.coords.latitude,
                long: position.coords.longitude
            });
        }, () => { //THIS IS MY SECOND FUNCTION THAT HANDLE THE ERRORS
            alert('Unable to Fetch Location!!!!'); //SEND AN ALERT ABOUT THE ERROR
        });
    }
});

//RECEIVING DATA FROM SERVER - LOCATION DATA MESSAGE
socket.on('newLocationMessage', locationData => {
    const formatedTime = moment(locationData.createdAt).format('LT'); // LE DOY FORMATO A MI FECHA Y HORA PARA QUE LUZCA BIEN
    const template = document.querySelector('#location-message-template').innerHTML; // SELECCIONO EL HTML DENTRO DEL SCRIPT QUE PUSE
    const html = Mustache.render(template, {
        from: locationData.from,
        url: locationData.url,
        createdAt: formatedTime
    }); //RENDERIZO EL SCRIPT CON MUSTACHE

    const div = document.createElement('div'); //CREO ELEMETNO DIV
    div.innerHTML = html; //AÑADO EL HTML DEL SCRIPT AL DIV

    document.querySelector('#messages').appendChild(div); //COMO ESTOY RENDERIZANDO HTML NO DEBO PONER APPENCHILD SINO APPEND
    
    //const li = document.createElement('li'); //CREATE LI ELEMENT

    //const aElement = document.createElement('a');
    //aElement.setAttribute('target', '_blank'); //CON ESTO ABRO MI PAGINA DEL LINK EN OTRA PESTAÑA
    //aElement.setAttribute('href', locationData.url); //LE PASO MI URL PARA REDIRIGIR A LA PAGINA
    //aElement.innerHTML = 'My Current Location'; //LE PONGO EL TEXTO

    //li.innerText = `${locationData.from} ${formatedTime}: `;
    //li.appendChild(aElement); //le paso mi a tag a li para ponerlo en el HTML

    //document.querySelector('#messages').appendChild(li);
});