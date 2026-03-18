const mongoose = require('mongoose');
const Reading = require('./models/Reading');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    const counts = await Reading.countDocuments();
    const readings = await Reading.find();
    console.log(`There are ${counts} readings`);
    console.log(readings);
    
    const countUsers = await User.countDocuments();
    console.log(`There are ${countUsers} users`);
    
    mongoose.disconnect();
}).catch(console.error);
