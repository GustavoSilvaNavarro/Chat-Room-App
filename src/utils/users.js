//CREATING CLASS ES6
class User {
    constructor() { //EL CONSTRUCTOR DE LAS VARIABLES COMO OBJETO CORRE DE MANERA AUTOMATICA
        this.users = [];
    };

    //METHODS
    //Add User
    addUser(id, name, room) {
        const user = { id, name, room }; //CREO MI OBJETO PAA INGRESARLO
        this.users.push(user); //METO MI NUEVO USUARIO A MI LISTA DE USUARIOS QUE PUSE EN MI CONSTRUCTOR
        return user; //esta funcion guarda mi usuario en el constructor y me devuelve el usuario guardado
    };

    //Get User List
    getUserList(room) {
        const users = this.users.filter(user => user.room === room); //CREO FUNCION QUE ME DA UNA LISTA DE USUARIO CUYA PROPIEDAD ROOM ES IGUAL AL ROOM QUE ESTOY PASANDO
        const newUserArray = users.map(user => user.name); //CREO NUEVA LISTA DE USUARIOS AL COLOCAR MAP ME GENERA UNA NUEVA LISTA CON SOLO LOS NOMBRES
        return newUserArray;
    };

    //Get User by Id
    getUser(id) {
        return this.users.filter(user => user.id === id)[0]; //VOY A TENER EL PRIMER ELEMENTO DE LA LISTA ES DECIR SOLO UN USUARIO / AL COLOCARLE QUIERO EL PRIMER ELEMENTO SOLO ME DARA EL OBJETO YA NO COMO LISTA DE OBJETO SINO SOLO EL OBJETO
    };

    //Remove user from List
    removeUser(id) {
        let user = this.getUser(id); //PRIMERO CONSIGO EL OBJETO QUE QUIERO ELEMINAR / QUE SERIA EL USUARIO
        if (user) { //digo en caso tenga un usuario
            this.users = this.users.filter(user => user.id !== id);
        }

        return user;
    };
};

//EXPORTING CLASS WITH METHODS AND CONSTRUCTOR
module.exports = { User };