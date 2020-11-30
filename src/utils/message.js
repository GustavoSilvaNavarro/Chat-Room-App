//CALL MODULES AND METHODS}
const moment = require('moment');

//CREATE NEW VARIBALE
//Normal Messages
const generateMessage = (from, text) => {
    return {
        from,
        text,
        createdAt: moment().valueOf()
    };
};

//Location Messages
const generateLocationMessage = (from, lat, lng) => {
    return {
        from,
        url: `https://www.google.com/maps?q=${lat}, ${lng}`,
        createdAt: moment().valueOf()
    };
};
//EXPORTING VARIABLE
module.exports = { generateMessage, generateLocationMessage };