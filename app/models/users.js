var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    firstname:{
        type:String,
        required:true,
        default:''
    },
    lastname:{
        type:String,
        required:false,
        default:''
    },
    username:{
        type:String,
        unique:true,
        required:true
    },
    password:String,
    admin:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
});

UserSchema.methods.getName = function(){
        return (this.firstname +' '+ this.lastname);
};

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
