var fs = require('fs');
var jwt = require('jsonwebtoken');
var express = require('express');
var router = express.Router();

var configuration = require('../configurations/configuration');

var storeClient = require('../configurations/redisClient').storeClient;
var subClient = require('../configurations/redisClient').subClient;
var pubClient = require('../configurations/redisClient').pubClient;

// var cert = fs.readFileSync('./configurations/TLS/ryans-key.pem'); // secretOrPrivateKey


router.post('/authenticate', function(req, res, next) {
    var account = req.body;
    var token = jwt.sign(account, "nonumber1989", {
        algorithm: configuration.jwt.jwtAlgorithm,
        expiresIn: configuration.jwt.expiresIn
    });
    res.json({
        userToken: token
    });
});

router.post('/redis', function(req, res, next) {
    // var redis = req.body;
    storeClient.set("stevenStr", "here is steven string test", function print (err, reply) {
    if (err) {
        // A error always begins with Error:
        console.log(err.toString());
    } else {
        console.log('Reply: ' + reply);
    }
});
    storeClient.hset("stevenHash", "hashKeyOne", "hashValueOne", function print (err, reply) {
    if (err) {
        // A error always begins with Error:
        console.log(err.toString());
    } else {
        console.log('Reply: ' + reply);
    }
});
    storeClient.hset(["stevenHash", "hashKeyTwo", "hashValueTwo"], function print (err, reply) {
    if (err) {
        // A error always begins with Error:
        console.log(err.toString());
    } else {
        console.log('Reply: ' + reply);
    }
});

    res.send("redis is done !");
});

router.get('/redis', function(req, res, next) {

	storeClient.hgetall("stevenHash", function(err, reply) {
	    // reply is null when the key is missing
	    console.log(reply);
	});
	
    storeClient.hkeys("stevenHash", function(err, replies) {
        console.log(replies.length + " replies:");
        replies.forEach(function(reply, i) {
            console.log("    " + i + ": " + reply);
        });
        res.json(replies);
        // storeClient.quit();
    });
});


var msg_count = 0;

subClient.on("subscribe", function (channel, count) {
    pubClient.publish("a nice channel", "I am sending a message.");
    pubClient.publish("a nice channel", "I am sending a second message.");
    pubClient.publish("a nice channel", "I am sending my last message.");
});

subClient.on("message", function (channel, message) {
    console.log("sub channel " + channel + ": " + message);
    msg_count += 1;
    if (msg_count === 10) {
        subClient.unsubscribe();
        subClient.quit();
        pubClient.quit();
    }
});

subClient.subscribe("a nice channel");


module.exports = router;
