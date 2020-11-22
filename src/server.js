//ENVIROMENT VARIBLES CONFIRMATION

//CALL MODULES AND METHODS
const express = require('express');
const path = require('path');

//INITIALIZATIONS
const app = express();

//SETTINGS
app.set('port', process.env.PORT || 3000);

//MIDDLEWARES

//GLOBAL VARIABLES

//ROUTES

//STATIC FILES
app.use(express.static(path.join(__dirname, 'public')));

//SERVER
app.listen(app.get('port'), () => {
    console.log('Server on Port.....', app.get('port'));
});