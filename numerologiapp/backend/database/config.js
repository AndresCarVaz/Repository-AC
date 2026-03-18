const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Base de datos conectada: MongoDB');
    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de inicializar la BD');
    }
};

module.exports = {
    dbConnection
};
