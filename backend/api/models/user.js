const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  fname: String,
  lname: String,
  dob: String,
  email: String,
  age: Number,
  gender: String,
  contact: Number,
  education: String,
  adress: String,
  city: String,
  state: String,
  pincode: Number,
  
});

const User = mongoose.model('User', userSchema);

module.exports = User;