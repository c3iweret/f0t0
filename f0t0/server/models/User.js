var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    images: {type: Array, required: false},
});

var User = mongoose.model("users", UserSchema);
module.exports = User;