var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/users');
var Verify = require('../verify');

router.post('/register', function(req,res,next){
    User.register(new User({username: req.body.username, firstname:req.body.firstname, lastname:req.body.lastname}), req.body.password, function(err,user){
        if(err){
            res.status(500).json({err:err, msg:"Error registering the user"});
        }

        passport.authenticate('local')(req,res,function(){
            res.status(200).json({msg:"Registration successfull"});
        });
    });
});

router.post('/login', function(req,res,next){
    passport.authenticate('local', function(err, user, info){
        if(err){
           res.status(500).json({err:err,message:info});
       }
       else if(!user){
           res.status(401).json({err:info});
       }
       else{
           req.login(user, function(err){
               if(err){
                   res.status(500).json({err:err, msg:"Error logging in the user"});
               }

               var token = Verify.getToken({id:user._id, username:user.username, name: user.getName(), admin:user.admin});

               res.status(200).json({
                   success:true,
                   msg:"Login successfull",
                   fullname:user.getName(),
                   token:token
               });
           });//req.login

       }

    })(req,res,next);

});//route.post

router.get('/logout', function(req,res,next){
    req.logOut();
    res.status(200).json({success:true, msg:"Logout successfull"});
});

module.exports = router;
