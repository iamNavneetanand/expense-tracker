const mongoose = require('mongoose');

const db = async () => {
    try {
        mongoose.set('strictQuery', false);

        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('DB Connected Successfully');
    } catch (error) {
        console.log('DB Connection Error:', error);
    }
}

module.exports = { db };