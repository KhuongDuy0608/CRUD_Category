let mongoose = require('mongoose');

let menuSchema = mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu',
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
})

module.exports = mongoose.model('menu',menuSchema);