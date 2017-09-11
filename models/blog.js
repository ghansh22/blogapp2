/* ==================================================
    Import node modules
===================================================*/
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

/*================================================================
Title Validation
================================================================*/
let titleLengthChecker = (title) =>{
    if(!title){
        // emailLengthChecker will not be executed if email is not provided 
        return false;
    }else{
        if(title.length<5 || title.length>50){
            return false;
        }else{
            return true;
        }
    }
};

let alpaNumericTitleChecker = (title) =>{
    if(!title){
        return false;
    }else{
        const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
        // console.log('email test: '+regExp.test(email));
        return regExp.test(title);//this will return true/flase on email validation
    }
}
const titleValidators = [
    {
        validator: titleLengthChecker,
        message: 'Please provide a title with at least 5 chars, not more than 50 chars' 
    },
    {
        validator: alpaNumericTitleChecker,
        message: 'Title must be alpha numeric.'
    }
]

/*================================================================
body Validation
================================================================*/
let bodyLengthChecker = (body) =>{
    if(!body){
        // emailLengthChecker will not be executed if email is not provided 
        return false;
    }else{
        if(body.length<5 || body.length>500){
            return false;
        }else{
            return true;
        }
    }
};

const bodyValidators = [
    {
        validator: bodyLengthChecker,
        message: 'Please provide a blog body with at least 5 chars, not more than 500 chars' 
    }
] 

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
        validate: titleValidators
    },
    body: {
        type: String,
        required: true,
        validate: bodyValidators
    },
    createdBy: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    likes: {
        type: Number,
        default: 0
    },
    likedBy: {
        type: Array
    },
    dislikes: {
        type: Number,
        default: 0
    },
    dislikedBy: {
        type: Array
    }
});

module.exports = mongoose.model('Blog',blogSchema);