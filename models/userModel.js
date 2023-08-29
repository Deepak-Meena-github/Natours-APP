const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');
// name,    email,photo,password,passwordconfirm
const userSchema= new mongoose.Schema({
    name:{
        type: String,
        required:[true,"please tell your name"]
    
    },
    email:{
        type:String,
        required:[true,"please tell your E-mail"],
        unique:true,
        lowercase:true,
        validator:[validator.isEmail,'please provide a valid E-mail']
    },
    photh: String,
    password:{
        type:String,
        required:[true,'please enter your password'],
        minlength:8

    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
          // This only works on CREATE and SAVE!!!
          validator: function(el) {
            return el === this.password;
          },
          message: 'Passwords are not the same!'
        }
      },
    


})
userSchema.pre('save', async function(next){
    //only run this function when password modified
    if(!this.isModified('password')) return next();
    //hash the paswword with cost of twelve
     this.password= await bcrypt.hash(this.password,12); /// so that's how we encrypted it 
    // delete the passwordConfrim of 12 cost
     this.passwordConfirm=undefined;
     next();
})
const user=mongoose.model('user',userSchema);
module.exports = user;