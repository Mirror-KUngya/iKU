const mongoose = require('mongoose');

exports.mongoDB = () => {
    mongoose
    .connect('mongodb+srv://ikuUser:iku1111@ikudb.orjj5fj.mongodb.net/iku_db')
    .then(() => console.log('mongodb is connected'))
    .catch(() => console.log('failed'))
}