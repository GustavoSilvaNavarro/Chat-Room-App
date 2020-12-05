//START CONNECTION USING OBJECT IO
const socket = io(); //se va a conectar al dominio en este caso al localhost y le debo dar la ruta donde se va a dar la coneccion en tiempo real / Genero mismo id en el servidor y en el frontend asi saben que es el mismo

//DOM VARIABLES
const btn = document.querySelector('#btn');
const userMessage = document.querySelector('input[name="message"]'); //DE ESTA FORMA LLAMO CON ETIQUETAS NAME
const geoLocatBtn = document.querySelector('#send-location');

//FUNCTIOS AND METHODS
function scrollToBottom() {
    let messages = document.querySelector('#messages').lastElementChild; //obtengo de mi lista de chat de mensajes el ultimo child (OSEA EL ULTIMO LI AÑADIDO)
    messages.scrollIntoView(); //CON ESTO LE DIGO EL ULTIMO MENSAJE QUE ENVIE USA EL SCROLL HASTA QUE LO VEA

}

//SOCKET EVENT USER CONNECTIONS - Receive it from server / CONNECT CLIENT (user)
socket.on('connect', () => {
    console.log('Connected to server!!!');
    //LOADS WHEN I CONNECT TO THE ROOM TO TAKE DATA FROM THE URL
    const params = window.location.search.substring(1); //CON ESTO TRAIGO LOS DATOS DE MI URL PERO COMO UN STRING / NO OLVIDAR EL .substring(1) YA QUE CON ESO LE QUITO EL ? DEL QUERY SINO LO MANTENDRIA
    const objectparams = JSON.parse('{"' + decodeURI(params).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g, '":"') + '"}'); //AL TRAER ESOS DATOS DEBO QUITARLES LOS SIGNOS RAROS Y DEJARLO COMO OBJETO Y LUEGO PASARLO A FORMATO JSON PARA RECIEN TENER UN OBJETO
    
    //SOCKET SENDING EVENT TO THE SERVER - CREATE ROOM
    socket.emit('join-room', objectparams, (err) => { //ESTA FUNCION DEL ERROR ES UN CALLBACK DEL SOCKET
        if(err) {
            alert(err); //ES ERROR PORQUE VIENE DESDE EL SERVER
            window.location.href = '/';
        } else {
            console.log('No Error!');
        };
    });
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
    scrollToBottom(); //USA LA FUNCION DE MOSTRAR EL ULTIMO MENSAJE
});

//EVENT TO SEND DATA TO THE SERVER - CHAT MESSAGES
btn.addEventListener('click', (e) => {
    //SOCKET SENDING EVENT TO THE SERVER - CHAT MESSAGES
    socket.emit('create-messages', {
        text: userMessage.value
    }, () => { // COLOCO UN CALLBACK
        userMessage.value = ''; // LO BUENO DEL ACKNOWLEDGE ES QUE ES VICEVERSA PUEDO ENVIAR EL CALLBACK DESDE EL CLIENTE LE ENVIO LA ACCION O DESDE EL SERVIDOR LE ENVIO ALGUN DATO
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
    scrollToBottom(); //USA LA FUNCION DE MOSTRAR EL ULTIMO MENSAJE
    
    //const li = document.createElement('li'); //CREATE LI ELEMENT

    //const aElement = document.createElement('a');
    //aElement.setAttribute('target', '_blank'); //CON ESTO ABRO MI PAGINA DEL LINK EN OTRA PESTAÑA
    //aElement.setAttribute('href', locationData.url); //LE PASO MI URL PARA REDIRIGIR A LA PAGINA
    //aElement.innerHTML = 'My Current Location'; //LE PONGO EL TEXTO

    //li.innerText = `${locationData.from} ${formatedTime}: `;
    //li.appendChild(aElement); //le paso mi a tag a li para ponerlo en el HTML

    //document.querySelector('#messages').appendChild(li);
});

//RECEIVING A SOCKET EVENT - TO UPDATE USER
socket.on('update-user-list', (users) => {
    const ol = document.createElement('ol'); //CREO ELEMENTO OL
    users.forEach(user => { //RECORRO MI LISTA DE ARREGLO DE LOS USUARIOS
        const li = document.createElement('li');
        li.innerHTML = user; //PONGO MI HTML
        ol.appendChild(li);
    });

    const userList = document.querySelector('#users');
    userList.innerHTML = ""; //PARA QUE CUANDO INICIE ESTE LIMPIE EL ANTERIOR Y LO COLOQUE DE NUEVO CUANDO ACTUALICE LOS USUARIOS AL SALIR Y ENTRAR
    userList.appendChild(ol);
});