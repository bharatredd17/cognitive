const mongoose = require('mongoose');

const AutisamSchema = new mongoose.Schema({
  name: String,
  email: String,
  score: Number,
  
});

const Autisamscore = mongoose.model('Autisam', AutisamSchema);

module.exports = {Autisamscore};