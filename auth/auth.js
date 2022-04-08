const express = require('express');
const router = express.Router();
let  Auth = require("../models/auth");
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
let secretKey = "jhvsacmabc mbKAbcjabcl";

router.post('/signin',async (req,res) => {
    try {
        let {email,password} = req.body;
        let user = await Auth.findOne({email:email});
        let result =  await bcrypt.compare(password,user.password);

        if(result == false){
            return res.status(300).send('please enter the valid emailId and password');
        }

        let payload = user._id;
        let token = await jwt.sign({payload},secretKey);
        console.log(token);
        let modifyToken = `${token} ${email}`;
        res.cookie('isLogin',modifyToken,{maxAge:99999});
        
        res.send("hello");
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/signup',async(req,res) => {
    try {
        let salt = await bcrypt.genSalt();
        req.body.password = await bcrypt.hash(req.body.password,salt);
        req.body.confirmPassword = req.body.password;
        let {name,password,confirmPassword,email} = req.body;
        let user = await Auth.create({name,password,email,confirmPassword});
        let payload = user._id;
        let token = await jwt.sign({payload},secretKey);
        let modifyToken = `${token} ${email}`;
        res.cookie('isLogin',modifyToken,{maxAge:99999});
        res.status(200).send("done");
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/',(req,res) => {
    res.status(200).render('signin');
});

router.get('/SignUp',(req,res) => {
    res.status(200).render('signup');
});

router.get('/SignIn',(req,res) => {
    res.status(200).render('signin');
});

module.exports = router;