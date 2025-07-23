const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    email: String,
    scores: Object
});

const Activity = mongoose.model('Activity', ActivitySchema);

module.exports = {Activity};