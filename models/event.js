var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let eventSchema = new Schema({
    type: {
        type: String
    },
    date: {
        type: String
    },
    time: {
        type: String
    },
    user: {
        type: String
    }
}, {
    collection: 'events'
})

module.exports = mongoose.model('Event', eventSchema);
