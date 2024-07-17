// User Schema
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs")

const schema = new mongoose.Schema({
  googleId: String,
  displayName: String,
  email: String,
  password:String,
  tokens:[
    {
        token: {
            type: String,
            required: true
        }
    }
  ]
  

});

// Hashing the password
schema.pre('save', async function (next) {
  // Only hash the password if it's been modified and is not empty
  if (this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(this.password, 12);
    console.log("password hash success");
  }
  next();
});

//Generating Token
schema.methods.generateAuthToken = async function(){
  try{
   let token = jwt.sign({_id:this._id}, process.env.SECRET_KEY);
   this.tokens = this.tokens.concat({token:token});
   await this.save();
   return token;
  }catch(err){
   console.log(err);
  }
  }



const userSchema = mongoose.model('USER', schema);

module.exports = userSchema;
