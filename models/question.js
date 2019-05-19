const mongoose = require('mongoose');
const questionSchema = new mongoose.Schema({
    text: String,
    tags: [String],
    answers: [{
        text: String,
        tag: String, 
    }],
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;