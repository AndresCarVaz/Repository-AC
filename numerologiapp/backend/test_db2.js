const mongoose = require('mongoose');
const Reading = require('./models/Reading');
const fs = require('fs');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    const readings = await Reading.find();
    fs.writeFileSync('readings_output.json', JSON.stringify(readings, null, 2));
    mongoose.disconnect();
}).catch(console.error);
