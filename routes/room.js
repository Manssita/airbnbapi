var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Room = require("../models/room");

// mongoose
var mongoose = require("mongoose");

// page publication 
router.post('/publish', function(req, res){
    var autho = req.headers.authorization;
    autho = autho.split(' ');
    var popAutho = autho.pop();
    User.findOne({token : popAutho}, function(err, user) {
        if(!err){
            var obj = {
                "title": req.body.title,
                "description": req.body.description,
                "photos": req.body.photos,
                "price": req.body.price,
                "ratingValue":req.body.ratingValue,
                "reviews": req.body.reviews,
                "city": req.body.city,
                "loc": [req.body.loc[0], req.body.loc[1]],
                "user": user._id
            }
            // 3) Créer des documents
            var roomNew = new Room(obj);
            roomNew.save(function(err, room) {
                if (!err) {
                    user.rooms.push(room)
                    user.save();
                    console.log(user)
                    console.log(user.rooms)
                        res.json({
                            "_id": obj._id,
                            "title": obj.title,
                            "description": obj.description,
                            "photos": obj.photos,
                            "price": obj.price,
                            "city": obj.city,
                            "loc": obj.loc,
                            "ratingValue": obj.ratingValue,
                            "reviews": obj.reviews,
                            "user": {
                                "_id": obj.user,
                                "account": {
                                  "username": user.account.username,
                                }
                            },
                        });
                }
            }); 
        } else {
            console.log(err);
        }
    }); 

});

//page info sur appartement
router.get('/:id', function(req, res){
    Room.findOne({_id : req.params.id}, function(err, room) {
        User.findOne({_id : room.user}, function(err, user) {
            res.json({
                "_id": room._id,
                "title": room.title,
                "description":room.description,
                "photos": room.photos,
                "price": room.price,
                "city": room.city,
                "loc": [room.loc[0], room.loc[1]],
                "ratingValue": room.ratingValue,
                "reviews": room.reviews,
                "user": {
                "_id": room.user,
                "account": {
                    "username": user.account.username
                }
                }
            });
        });
    });
});

// page recherch
// page type offer 
router.get('', function (req, res) {
    var response = req.query.city;
    if(response){
        Room.find({city: response}, function(err, room) {
            res.json({
                "rooms": [room], // Tableau contenant les informations des appartements trouvés
                "count": room.length // Nombre de résultats
              });
        });
    }
    else {
        res.json({
            "error": {
              "message": "Invalid request"
            }
        })
    }
});
module.exports = router;