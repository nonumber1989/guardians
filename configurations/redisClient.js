var redis = require("redis");
var client = redis.createClient();

client.on('ready', function() {
    console.log('Ready to Redis');
});

client.on('connect', function() {
    console.log('Connected to Redis');
});

client.on("error", function(err) {
    console.log("Error " + err);
});

module.exports = client;



