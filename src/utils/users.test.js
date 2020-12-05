//CALL MODULES AND METHODS
const expect = require('expect');
const { User } = require('./users');

//DESCRIBING BLOCK TESTS
//First describing block tests
describe('Adding some users', () => {
    //CREATING DATA
    let newUser;

    //Methods
    beforeEach(() => { //VA A CORRER ANTES DE CADA SIEMPRE TEST
        newUser = new User();
        //LO HAGO CON EL FIN DE CREAR DATA
        newUser.users = [{
            id: '1',
            name: 'Gustavo',
            room: 'Perro'
        },
        {
            id: '2',
            name: 'Christarat',
            room: 'GyC'
        },
        {
            id: '3',
            name: 'Randolf',
            room: 'Perro'
        }]; //LLAMO A MI LISTA DE OBJETOS
    }) //CREO TODA ESTA DATA PARA PODERLA PROBAR LUEGO EN LOS SIGUIENTES METODOS

    //Single Test's inside the block
    it('Should add new User', () => {
        const newUser = new User();
        const user = {
            id: 'Hola',
            name: 'Gustavo',
            room: 'Perro'
        };
        const reUser = newUser.addUser(user.id, user.name, user.room); //ASI LLAMO A MI METODO O LO INSTO

        //POSSIBLE RESULTS FROM TEST
        expect(newUser.users).toEqual([user]); // le digo el objeto del constructor debe ser igual al objeto que yo le di
    });

    it('Should return the list of names in a new array - Perro', () => {
        const userList = newUser.getUserList('Perro');

        //POSSIBLE RESULTS FROM TEST
        expect(userList).toEqual(['Gustavo', 'Randolf']); //COMPRUEBO LOS NOMBRES QUE ESTARRAN EN MIS LISTA
    });

    it('Should return the list of names in a new array - GyC', () => {
        const userList = newUser.getUserList('GyC');

        //POSSIBLE RESULTS FROM TEST
        expect(userList).toEqual(['Christarat']); //COMPRUEBO LOS NOMBRES QUE ESTARRAN EN MIS LISTA
    });

    it('Should find the user that i want', () => {
        const userId = '2';
        const user = newUser.getUser(userId)

        //POSSIBLE RESULTS FROM TEST
        expect(user.id).toBe(userId); //compruebo que mis id son iguales
    });

    it('Should not find the user', () => { //PRUEBO CUANDO ES INDEFINIDO
        const userId = '5';
        const user = newUser.getUser(userId)

        //POSSIBLE RESULTS FROM TEST
        expect(user).toBeUndefined(); //compruebo que mis id son iguales
    });

    it('Should not Remove a User', () => { //cuando el id no existe
        const userId = '6';
        const user = newUser.removeUser(userId);

        //POSSIBLE RESULTS FROM TEST
        expect(user).toBeUndefined();
        expect(newUser.users.length).toBe(3); //YA NO BORRE O REMOVI A NIGUNO
    });

    it('Should Remove a User', () => {  //PRUEBO CUANDO EL ID EXISTE Y ME DEBE DAR NOMBRES
        const userId = '1';
        const user = newUser.removeUser(userId);

        //POSSIBLE RESULTS FROM TEST
        expect(user.name).toEqual('Gustavo');
        expect(newUser.users.length).toBe(2);
    });
});