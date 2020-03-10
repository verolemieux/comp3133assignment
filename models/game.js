var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let gameSchema = new Schema({
    player1: {
        type: String
    },
    player2: {
        type: String
    },
    winner: {
        type: String
    },
    scorePlayer1: {
        type: Number
    },
    scorePlayer2: {
        type: Number
    }
}, {
    collection: 'games'
})

module.exports = mongoose.model('Game', gameSchema);

