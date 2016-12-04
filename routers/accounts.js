var fs = require('fs');
var jwt = require('jsonwebtoken');
var express = require('express');
var router = express.Router();

var configuration = require('../configurations/configuration');

var redisClient = require('../configurations/redisClient');

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
    redisClient.set("string key", "string val", function print (err, reply) {
    if (err) {
        // A error always begins with Error:
        console.log(err.toString());
    } else {
        console.log('Reply: ' + reply);
    }
});
    redisClient.hset("hash key", "hashtest 1", "some value", function print (err, reply) {
    if (err) {
        // A error always begins with Error:
        console.log(err.toString());
    } else {
        console.log('Reply: ' + reply);
    }
});
    redisClient.hset(["hash key", "hashtest 2", "some other value"], function print (err, reply) {
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

	redisClient.hgetall("hash key", function(err, reply) {
	    // reply is null when the key is missing
	    console.log(reply);
	});
	
    redisClient.hkeys("hash key", function(err, replies) {
        console.log(replies.length + " replies:");
        replies.forEach(function(reply, i) {
            console.log("    " + i + ": " + reply);
        });
        res.json(replies);
        // redisClient.quit();
    });
});

module.exports = router;
