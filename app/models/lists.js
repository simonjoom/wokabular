var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WordSchema = new Schema({
    word:{
        type:String,
        required:true,
        default:''
    },
    description:{
        type:String,
        required:false,
        default:''
    },
    mneumonic:{
        type:String,
        required:false,
        default:''
    }
});

var ListSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    name:{
        type:String,
        required:true,
        default:''
    },
    author:{
        type:String,
        required:false,
        default:''
    },
    words:[WordSchema]
},
{
    timestamps:true
});

module.exports = mongoose.model('List', ListSchema);
