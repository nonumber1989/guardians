var fs = require('fs');
var jwt = require('jsonwebtoken');
var express = require('express');
var router = express.Router();

var configuration = require('../configurations/configuration');
var cert = fs.readFileSync('./configurations/TLS/ryans-key.pem'); // secretOrPrivateKey

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

module.exports = router;
