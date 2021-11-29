const mongoose = require('mongoose');

const URI = process.env.ATLAS_URI;

exports.connectToDB = async () => {
    try {
        await mongoose.connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
        });
        console.log('Connected to MongoDB!');
    } catch (err) {
        console.log(err);
    }
}
