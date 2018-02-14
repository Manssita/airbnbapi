// express
var express = require('express');
var app = express();
app.use(express.static("public"));

// body parser
var bodyParser = require('body-parser');
app.use(bodyParser.json());

// mongoose
var mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/airbnb");
  
// 1) Definir le schema - A faire qu'une fois
var userSchema = new mongoose.Schema({
    account: {
       username: String,
       biography: String
    },
    email: String,
    token: String,
    hash: String,
    salt: String
 });

// 2) Definir le model - A faire qu'une fois
var User = mongoose.model("User", userSchema);

// Uid2
var uid2 = require('uid2');

// Crypto
var SHA256 = require("crypto-js/sha256");
var encBase64 = require("crypto-js/enc-base64");

// page création user
app.post('/api/user/sign_up', function (req, res) {
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
app.post('/api/user/log_in', function (req, res) {
    var logEmail = req.body.email;
    var logPassword = req.body.password;
    User.find({}, function(err, userFind) {

        for (var i = 0; i < userFind.length; i++) {
            if(userFind[i].email === logEmail){
                var hashPass = SHA256(logPassword + userFind[i].salt).toString(encBase64)
                if(userFind[i].hash === hashPass){
                    res.json({
                        "_id": userFind[i]._id,
                        "token": userFind[i].token,
                        "account": {
                          "username": userFind[i].account.username,
                          "biography": userFind[i].account.biography
                        }
                      })
                }
            }
            else {
                res.send('error');
            }
        }
    });

});

// page profil
app.get('/api/user/:id', function(req, res){
    var id = req.params.id;
    var autho = req.headers.authorization;
    User.find({_id : id}, function(err, userFind) {
        var check = "Bearer "+ userFind[0].token;
        if(check === autho) {
            res.json({
                "_id": userFind[0]._id,
                "account": {
                    "username": userFind[0].account.username,
                    "biography": userFind[0].account.biography
                }
            })
        }
        else {
            res.status(401).json({
                "error": {
                  "code": 9473248,
                  "message": "Invalid token"
                }
              })
        }
    });
});

app.get('/', function(req, res){
    res.send('ok')
});

app.get("*", function(req, res) {
    res.status(404).send("Cette route n'existe pas");
  });

app.post("*", function(req, res) {
    res.status(404).send("Cette route n'existe pas");
});
// start
app.listen(process.env.PORT || 3000, function () {
    console.log('Server started');
});