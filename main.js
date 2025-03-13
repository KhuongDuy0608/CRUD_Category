let mongoose = require('mongoose');

// var product = [{
//     name: "",
//     description: "",
//     quantity: "",
//     price: "",
//     urlimg: "",
//     category: "",
//     createAt: "",
//     updateAt: "",
//   }]



mongoose.connect('mongodb://localhost:27017/JS')
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB @ 27017');
});