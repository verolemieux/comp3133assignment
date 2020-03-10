var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let historySchema = new Schema({
    player: {
        type: String
    },
    opponent: {
        type: String
    },
    date: {
        type: String
    },
    time: {
        type: String
    },
    message: {
        type: String
    }
}, {
    collection: 'history'
})

module.exports = mongoose.model('History', historySchema);