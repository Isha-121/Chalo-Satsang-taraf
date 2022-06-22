const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const userSchema = new mongoose.Schema({
    email:{
        type:String,
    },
    username:
    {
        type:String,
    }
});
// userSchema.pre('save',async function(next){
//     if (this.isModified("password")) {
//         this.password = await bcrypt.hash(this.password, 10);
//        // this.confirm = undefined;
//     }
//     next();
// })
userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model('register',userSchema);
module.exports = User;