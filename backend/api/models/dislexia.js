const mongoose = require('mongoose');

const DislexiaSchema = new mongoose.Schema({
  name: String,
  email: String,
  score: Number,
  
});

const Dislexiascore = mongoose.model('Dislexia', DislexiaSchema);

module.exports = {Dislexiascore};