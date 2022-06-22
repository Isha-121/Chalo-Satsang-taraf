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
    [{username:String,replyText:String}]
})

module.exports = new mongoose.model("question",QuestionSchema);