//CALL MODULES AND METHODS
const expect = require('expect');
const { validateName } = require('./validation-name'); //CALLING METHOD WITH FUNCTION

//DESCRIBING BLOCK TESTS
//First describing block tests
describe('Validating String Name and Room', () => {
    //Single Test's inside the block
    it('Should reject non-string value', () => {
        const res = validateName(8536);
        
        //POSSIBLE RESULTS FROM TEST
        expect(res).toBe(false);
    });
    it('Should reject string with only spaces', () => {
        const res = validateName('               ');
        
        //POSSIBLE RESULTS FROM TEST
        expect(res).toBe(false);
    });
    it('Should allow string with non-space chars', () => {
        const res = validateName('        Tavo          ');
        
        //POSSIBLE RESULTS FROM TEST
        expect(res).toBe(true);
    });
});