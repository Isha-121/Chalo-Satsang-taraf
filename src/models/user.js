const mongoose = require('mongoose');
const passport_local_mongoose = require('passport-local-mongoose');
const userSchema = new mongoose.Schema({
    email:{
        type:String,
    },
    username:
    {
        type:String,
    },
    password:
    {
        type:String,
    },
    confirm:
    {
        type: String,
    },
    gender:
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
userSchema.plugin(passport_local_mongoose);
const Register = new mongoose.model('register',userSchema);
module.exports = Register;