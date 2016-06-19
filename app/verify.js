var jwt = require('jsonwebtoken');
var config = require('./config');

exports.getToken = function(userInfo){
    return jwt.sign(userInfo, config.secretKey, {
        expiresIn:43200 //Token expires in 12 Hours
    });
};

//custom Middleware for checking User credentials/token
exports.verifyUser = function(req,res,next){

    var token = req.body.token || req.body.query || req.headers['x-access-token'];

    if(token){
        jwt.verify(token, config.secretKey, function(err, decoded){
            if(err){
                var err = new Error("You are not Authenticated. Token Mismatch.");
                err.status = 401;
                next(err);
            }
            else{
                req.decoded = decoded;
                next();
            }
        });
    }
    else{
        var err = new Error("You are not Authenticated. No token provided.");
        err.status = 401;
        next(err);
    }
};

//custom Middleware for checking if a User is an ADMIN
exports.verifyUserAsAdmin = function(req,res,next){
    if(req.decoded.admin){
        next();
    }
    else{
        var err = new Error("You are not authorized as an ADMIN");
        err.status = 403;
        next(err);
    }
};
