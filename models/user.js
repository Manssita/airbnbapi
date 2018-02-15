// mongoose
var mongoose = require("mongoose");


var userSchema = new mongoose.Schema({
    "account": {
      "username": String,
      "biography": String
    },
    "email": String,
    "token": String,
    "hash": String,
    "salt": String,
    "rooms": [{
      "type": mongoose.Schema.Types.ObjectId,
      "ref": "Room"
    }]
  });


var User = mongoose.model("User", userSchema);

module.exports = User;