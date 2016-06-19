var express = require('express');
var router = express.Router();
var Users = require('../models/users');
var Lists = require('../models/lists');
var Verify = require('../verify');

/* ADMIN ONLY */
router.route('/')
    .all(Verify.verifyUser, Verify.verifyUserAsAdmin)

    .get(function(req,res,next){
        //get all the users
        Users.find({}, function(err,users){
            if(err){
                res.status(500).json({err:err, msg:"Error getting all the users"});
            }

            res.status(200).json(users);
        });
    })

    .delete(function(req,res,next){
        //delete all the users
        Users.remove({}, function(err){
            if(err){
                res.status(500).json({err:err, msg:"Error deleting all the users"});
            }
            res.status(200).json({success:true, msg:"All the users deleted successfully"});
        })
    });

router.route('/:userId')
    .all(Verify.verifyUser, Verify.verifyUserAsAdmin)
    .get(function(req,res,next){
        //find a particulr user
        Users.findById(req.params.userId, function(err,user){
            if(err){
                res.status(500).json({err:err, msg:"Error in finding the user with userId : "+req.params.userId});
            }
            res.json(user);
        });
    })
    .put(function(req,res,next){
        //update an existing user
        Users.findByIdAndUpdate(req.params.userId,{ $set:req.body }, {new:true},
            function(err,user){
                if(err){
                    res.status(500).json({err:err, msg:"Error updating the user with id : "+req.params.userId});
                }
                res.json(user);
            });
    })

    .delete(function(req,res,next){
        //delete a particular user
        Users.findByIdAndRemove(req.params.userId, function(err){
            if(err){
                res.status(500).json({err:err, msg:"Error deleting the user with id : "+req.params.userId});
            }
            res.json({sucess:true, msg:"User with id : "+req.params.userId+" deleted successfully"});
        });
    });

module.exports = router;
