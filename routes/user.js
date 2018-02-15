var express = require("express");
var router = express.Router();
var User = require("../models/user")

  
// Uid2
var uid2 = require('uid2');

// Crypto
var SHA256 = require("crypto-js/sha256");
var encBase64 = require("crypto-js/enc-base64");

// page création user
router.post('/sign_up', function (req, res) {
    var salt = uid2(64);
    var hash = SHA256(req.body.password + salt).toString(encBase64);
    var obj = {
        account: {
            username: req.body.username,
            biography : req.body.biography,
        },
        email : req.body.email,
        token : uid2(64),
        hash : hash,
        salt : salt,
    }
    // 3) Créer des documents
    var user = new User(obj);
    user.save(function(err, obj) {
        if (!err) {
            res.json({
                "_id": obj._id,
                "token": obj.token,
                "account": {
                  "username": obj.account.username,
                  "biography": obj.account.biography
                }
              });
        }
    }); 
});

// page login
router.post('/log_in', function (req, res) {
    var logEmail = req.body.email;
    var logPassword = req.body.password;
    User.findOne({email : logEmail}, function(err, userFind) {
        if(!err){
            var hashPass = SHA256(logPassword + userFind.salt).toString(encBase64)
            if(userFind.hash === hashPass){
                res.json({
                    "_id": userFind._id,
                    "token": userFind.token,
                    "account": {
                        "username": userFind.account.username,
                        "biography": userFind.account.biography
                    }
                    })
            }
            else {
                res.json({
                    "error": {
                      "message": "Invalid request"
                    }
                })
            }
        }
        else {
            res.json({
                "error": {
                  "message": "Invalid request"
                }
            })
        }
    });

});
// page profil
router.get('/:id', tokenIsFound, function(req, res){
    var autho = req.autho.split(' ');
    var popAutho = autho.pop();
    User.findOne({token : popAutho}, function(err, user) {
        if(user){
            User.findOne({_id : req.params.id}, function(err, userFind) {
                res.json({
                    "_id": userFind._id,
                    "account": {
                        "username": userFind.account.username,
                        "biography": userFind.account.biography
                    }
                })
            });
        }
        else {
            res.json({
                "error": {
                  "code": 9473248,
                  "message": "Invalid token"
                }
              })
        }
    })

});

function tokenIsFound(req, res, next) {
    var autho = req.headers.authorization;
    if (autho) {
        req.autho = autho;
        next();
    } else {
        res.json({
            "error": {
              "code": 48326,
              "message": "Invalid token"
            }
          });
    }
}

module.exports = router;