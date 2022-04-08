const mongoose = require('mongoose');
const validator = require('email-validator');

let schema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:function(){
            return validator.validate(this.email);
        },
    },
    password:{
        type:String,
        required:true,
    },
    confirmPassword:{
        type:String,
        required:true,
        validate:function(){
            return this.confirmPassword === this.password;
        }
    },
    postLikes:{
        type:Array,
        default:[],
    },
});

schema.pre('save',function(){
    console.log(this.name);
    console.log(this.confirmPassword);
    console.log(this.email);
    console.log(this.password);
    this.confirmPassword = undefined;
});

module.exports = new mongoose.model('Auth',schema);