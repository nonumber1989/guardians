var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var authUtils = require('../helpers/authUtils');


router.post('/authenticate', function(req, res, next) {
  var account = req.body;
  if (account.id !== undefined) {
    var token = authUtils.generateToken(account);
    res.json({
      userToken: token
    });
  } else {
    res.json({
       error:"please provided your ID"
    });
  }

});


module.exports = router;