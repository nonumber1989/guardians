var fs = require('fs');
var jwt = require('jsonwebtoken');
var express = require('express');
var router = express.Router();

var Account = mongoose.model("account");

var configuration = require('../configurations/configuration');
var cert = fs.readFileSync('./configurations/TLS/ryans-key.pem'); // secretOrPrivateKey


router.get('/', function(req, res, next) {
  var pagenation = requestUtils.getPagenation(req);
  var queryPromise = Account.find({}, {}, pagenation).exec();
  queryPromise.then(function(accounts) {
    if (accounts) {
      res.json(accounts);
    } else {
      responseUtils.resourcesNotFoundError(res);
    }
  }).catch(function(err) {
    responseUtils.internalError(res, err);
  });
});

//get the account by id
router.get('/:id', function(req, res, next) {
  var queryPromise = Account.findById(new ObjectId(req.params.id)).exec();
  queryPromise.then(function(account) {
    if (account) {
      res.json(account);
    } else {
      responseUtils.resourceNotFoundError(res, req.params.id);
    }
  }).catch(function(err) {
    responseUtils.internalError(res, err);
  });
});
//create an account
router.post('/', function(req, res, next) {
  var accountModel = new Account(req.body);
  accountModel.save().then(function(account) {
    res.json(account);
  }).catch(function(err) {
    responseUtils.internalError(res, err);
  });
});

// update the account by id
router.put('/:id', function(req, res, next) {
  var accountModel = new Account(req.body);
  var updatePromise = Account.findByIdAndUpdate(new ObjectId(req.params.id), accountModel).exec();
  updatePromise.then(function(account) {
    if (account) {
      res.json(account);
    } else {
      responseUtils.resourceNotFoundError(res, req.params.id);
    }
  }).catch(function(err) {
    responseUtils.internalError(res, err);
  });

});

//delete by id
router.delete('/:id', function(req, res, next) {
  Account.findByIdAndRemove(new Object(req.params.id)).then(function(account) {
    responseUtils.deletedSuccessfully(res, req.params.id)
  }).catch(function(err) {
    responseUtils.internalError(res, err);
  });
});


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
