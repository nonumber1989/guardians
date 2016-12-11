var fs = require('fs');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    fs.readFile(__dirname + '/index.html', function(err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading index.html');
        }
        res.writeHead(200);
        res.end(data);
    });
});

module.exports = router;
