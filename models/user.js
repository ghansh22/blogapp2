/* ==================================================
    Import node modules
===================================================*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

/* ==================================================
    email validation
===================================================*/
let emailLengthChecker = (email) =>{
    if(!email){
        return false;
    }else if(email.length < 5 || email.length > 35){
        return false
    }else{
        return true;
    }
}

let validEmailChecker = (email) =>{
    if(!email){
        return false;
    }else{
        const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regExp.test(email);
    }
}

const emailValidators = [
    {
        validator: emailLengthChecker,
        message: 'Email must consist on at least 5 and at most 35 characters'
    },
    {
        validator: validEmailChecker,
        message: 'The email must be in a valid format'
    }
];


/* ==================================================
    username validations
===================================================*/
let usernameLengthChecker = (username) =>{
    if(!username){
        return false;
    }else if(username.length < 3 || username.length > 15){
        return false;
    }else{
        return true;
    }
}

let validUsernameChecker = (username) =>{
    if(!username){
        return false;
    }else{
        const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
        return regExp.test(username);
    }
}

const usernameValidators = [
    {
        validator: usernameLengthChecker,
        message: 'An username must be at least 5 chars and at most 15 chars'
    },
    {
        validator: validUsernameChecker,
        message: 'An username must not contain any special character'
    }
];


/* ==================================================
    password validations
===================================================*/
let passwordLengthChecker = (password) =>{
    if(!password){
        return false;
    }else if(password.length<8 || password.length > 35){
        return false;
    }else{
        return true;
    }
}

let validPassword = (password) =>{
    if(!password){
        return false;
    }else{
        const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
        return regExp.test(password);
    }
}

const passwordValidators = [
    {
        validator: passwordLengthChecker,
        message: 'Password must be at least 5 and at most 35 chars'
    },
    {
        validator: validPassword,
        message: 'Password must consist at least one upppercase, one lowercase, one special character and a number'
    }
];

// user model definition
const userSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: emailValidators
    },
    username:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: usernameValidators
    },
    password:{
        type:String,
        required: true,
        validate: passwordValidators
    },
    activation:{
        type: Boolean,
        default: false
    },
    randomCode:{
        type: String,
        required: true
    } 
});

// Schema Middleware to Encrypt Password
userSchema.pre('save', function(next) {
  // Ensure password is new or modified before applying encryption
  if (!this.isModified('password'))
    return next();

  // Apply encryption
  bcrypt.hash(this.password, null, null, (err, hash) => {
    if (err) return next(err); // Ensure no errors
    this.password = hash; // Apply encryption to password
    next(); // Exit middleware
  });
});

userSchema.methods.comparePassword = function(candidatePassword){
    return bcrypt.compareSync(candidatePassword, this.password);
    // this.password is actual password from database
    // It returns true if password is matched
}



// exports module
module.exports = mongoose.model('User', userSchema);