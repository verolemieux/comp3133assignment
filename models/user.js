var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let userSchema = new Schema({
    username: {
        type: String
    },
    topScore: {
        type: Number
    },
    numWins: {
        type: Number
    }
}, {
    collection: 'users'
})

module.exports = mongoose.model('User', userSchema);