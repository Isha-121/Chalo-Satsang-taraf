const mongoose  = require('mongoose');
const QuestionSchema = new mongoose.Schema({
    username:{
        type:String,
    },
    questionText:{
        type:String,
        required:true,
        unique:true,
    },
    replies:
    [{username:{
        type: String},
     replyText:{type: String,
    required:true}}]
})

module.exports = new mongoose.model("question",QuestionSchema);