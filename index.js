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


var UsersRoutes = require("./routes/user");
var RoomsRoutes = require("./routes/room");
var AllRoutes = require("./routes/cors");

app.use("/api/user", UsersRoutes);
app.use("/api/room", RoomsRoutes);
app.use("/", AllRoutes);

// start
app.listen(process.env.PORT || 3000, function () {
    console.log('Server started');
});