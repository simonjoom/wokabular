var express = require('express');
var router = express.Router();
var Users = require('../models/users');
var Lists = require('../models/lists');
var Verify = require('../verify');

router.route('/')
    .all(Verify.verifyUser)
    .get(function(req,res,next){
        //show all lists
        Lists.find({user:req.decoded.id}, function(err, lists){
            if(err){
                res.status(500).json({err:err, msg:"Error getting user account"});
            }

            res.status(200).json(lists);
        });
    })

    .post(function(req,res,next){
        //add new list
        Lists.create({user:req.decoded.id, name:req.body.name, author:req.body.author},
        function(err, list){
            if(err){
                res.status(500).json({err:err, msg:"Error adding a new list"});
            }
            res.status(200).json(list);
        });
    })

    .delete(function(req,res,next){
        //delete all lists
        Lists.remove({user:req.decoded.id}, function(err){
            if(err){
                res.status(500).json({err:err, msg:"Error deleting all the lists"});
            }
            res.status(200).json({success:true, msg:"All the lists deleted successfully"});
        });
    });

router.route('/:list')
    .all(Verify.verifyUser)
    .get(function(req,res,next){
        //get a particular list
        Lists.findById(req.params.list, function(err,list){
            if(err){
                res.status(500).json({err:err, msg:"Error finding list with id : "+req.params.list});
            }
            res.json(list);
        });
    })

    .put(function(req,res,next){
        //update an existing list
        Lists.findByIdAndUpdate(req.params.list, { $set:req.body },{ new:true }, function(err, list){
            if(err){
                res.status(500).json({err:err, msg:"Error updating the list info"});
            }
            res.json(list);
        });
    })

    .delete(function(req,res,next){
        //delete a particular list
        Lists.findByIdAndRemove(req.params.list, function(err){
            if(err){
                res.status(500).json({err:err,msg:"Error deleting the list with id:"+ req.params.list});
            }
            res.status(200).json({success:true, msg:"List with id : "+req.params.list+" Deleted successfully"});
        })
    });

router.route('/:list/words')
    .all(Verify.verifyUser)
    .get(function(req,res,next){
        //add a new word
        Lists.findById(req.params.list, function(err,list){
            if(err){
                res.status(500).json({err:err,msg:"Error finding words in the list with id:"+ req.params.list});
            }

                res.json(list.words);

        });
    })
    .post(function(req,res,next){
        //add a new word
        Lists.findById(req.params.list, function(err,list){
            if(err){
                res.status(500).json({err:err,msg:"Error adding a word in the list with id:"+ req.params.list});
            }
            list.words.push(req.body);
            list.save(function(err,list){
                if(err){
                    res.status(500).json({err:err,msg:"Error saving word in the list"});
                }
                res.json(list);
            });
        });
    })
    .delete(function(req,res,next){
        //delete all words
        Lists.findById(req.params.list, function(err,list){
            if(err){
                res.status(500).json({err:err,msg:"Error adding a word in the list with id:"+ req.params.list});
            }
            for(var i=list.words.length-1;i>=0;i--){
                list.words.id(list.words[i]._id).remove();
            }
            list.save(function(err,list){
                if(err){
                    res.status(500).json({err:err,msg:"Error saving word in the list"});
                }
                res.json(list);
            });
        });
    });

router.route('/:list/words/:wordId')
    .all(Verify.verifyUser)
    .put(function(req,res,next){
        //update an existing word
        Lists.findOneAndUpdate({"_id":req.params.list, "words._id":req.params.wordId},
            {
                $set:{
                    "words.$.word":req.body.word,
                    "words.$.description":req.body.description || '',
                    "words.$.mneumonic":req.body.mneumonic || '',
                    "words.$._id":req.params.wordId
            }
        },{
            new:true
        },function(err, list){
            if(err){
                res.status(500).json({err:err,msg:"Error updating the word with id : "+ req.params.wordId +" in the list with id:"+ req.params.list});
            }
            res.json(list);
        });

    })

    .delete(function(req,res,next){
        //delete a particular word
        Lists.findById(req.params.list, function(err,list){
            if(err){
                res.status(500).json({err:err,msg:"Error adding a word in the list with id:"+ req.params.list});
            }
            list.words.id(req.params.wordId).remove();
            list.save(function(err,list){
                if(err){
                    res.status(500).json({err:err,msg:"Error saving word in the list"});
                }
                res.json(list);
            });
        });
    });

router.route('/all/totalwords')
    .all(Verify.verifyUser)
    .get(function(req,res,next){
        //show all the words from all the lists
        Lists.find({user:req.decoded.id}, function(err,lists){
            if(err){
                res.status(500).json({err:err,msg:"Error finding all the lists"});
            }

            var x=[];
            for(var i=0;i<lists.length;i++){
                x = x.concat(lists[i].words);
            }
            res.json(x);
        });
    });

module.exports = router;
