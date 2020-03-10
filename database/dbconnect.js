var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const url = 'mongodb://admin:admin@aliens-shard-00-00-eukpc.mongodb.net:27017,aliens-shard-00-01-eukpc.mongodb.net:27017,aliens-shard-00-02-eukpc.mongodb.net:27017/test?ssl=true&replicaSet=aliens-shard-0&authSource=admin&retryWrites=true&w=majority'

const connect = mongoose.connect(url, { useNewUrlParser: true })
    .then(() => {
        console.log('Database successfully connected')
    }, error => {
        console.log('Database could not be connected: ' + error)
    }
)

module.exports = connect;