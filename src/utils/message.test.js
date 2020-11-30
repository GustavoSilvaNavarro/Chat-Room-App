//CALL MODULES AND METHODS
const expect = require('expect'); //Call Module expect
const { generateMessage, generateLocationMessage } = require('./message'); //CALLIN METHOD WITH FUNCTION

//DESCRIBING BLOCK TESTS
//First describing block tests
describe('generate-message', () => {
    //Single Test inside the block
    it("Should generate correct message object", () => {
        let from = 'Gustavo';
        let text = 'Some Test message';
        let message = generateMessage(from, text);

        //POSSIBLE RESULTS FROM TEST
        expect(typeof message.createdAt).toBe('number'); //posible respuesta de que sea un numero
        expect(message).toMatchObject({ from, text }); //debe ser parecido a objeto from, text
    });
});

//Second block test
describe('Generate Location Message', () => {
    //Single Tests inside describe block
    it('Should generate correct location object', () => {
        const from = 'Christa';
        const lat = 15;
        const lng = 56;
        const url = `https://www.google.com/maps?q=${lat}, ${lng}`;
        let locationMessage = generateLocationMessage(from, lat, lng);

        //POSSIBLE RESULTS FROM TESTS
        expect(typeof locationMessage.createdAt).toBe('number'); //digo para comprobar el createdAt que es la hora o fecha es un numero
        expect(locationMessage).toMatchObject({ from, url }); //La funcion me debe dar un objeto parecido al objeto que eh pusto con from y url
    });
});