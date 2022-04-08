let images =  require("../models/images");
let Auth = require('../models/auth');

exports.protectedRoute = (req,res,next) => {
    let isLogin = req.cookies.isLogin;
    if(isLogin === undefined){
        isLogin = false;
    }
    if(isLogin){
        next();
    }else{
        res.redirect('/auth');
    }
}

exports.updatePost = async(req,res) =>{
        try {
            let {id} = req.params;
            let isLogin = req.cookies.isLogin;
            let [token,email] = isLogin.split(' ');
            let user = await Auth.findOne({email});
            if(user.postLikes.includes(id)){
                let update = await Auth.updateOne({$pull:{postLikes:id}});
               return res.status(200).send('dislike the post successfully');
            }else{
                let update = await Auth.updateOne({$push:{postLikes:id}});
                return res.status(200).send('like the post successfully');
            }
        } catch (error) {
            res.status(500).send(error);
        }
    };

exports.deletePost = async(req,res) => {
    try {
        let {id} = req.params;
        let isLogin = req.cookies.isLogin;
            let [token,email] = isLogin.split(' ');
            let user = await Auth.findOne({email});
            if(user.postLikes.includes(id)){
                let update = await Auth.updateOne({$pull:{postLikes:id}});
            }
        let ans = await images.findByIdAndDelete(id);
        res.redirect('/');
    } catch (error) {
        res.status(500).send(error);
    }
}
