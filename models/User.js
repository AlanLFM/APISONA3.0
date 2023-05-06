const mongoose=require("mongoose")
const UserSchema=new mongoose.Schema({
    username:{
        type:String,
        require:true,
        min:3,
        max:20,
        unique:true ,
    },
    role:{
      type:String,
      required:false,
      default:"user"  
    },
    email:{
        type:String,
        required:true,
        max:50,
        unique:true,
    },
    password:{
        type:String,
        require:true,
        min:3,
    },
    coverPicture:{
        type:String,
        default:"noCover.png",
    },
    profilePicture:{
        type:String,
        default:"noAvatar.png",
    },
    followers:{
        type:Array,
        default: [],
    },
    followings:{
        type:Array,
        default: [],
    },
    saved:{
        type:Array,
        default:[]
    },
    desc:{
        type:String,
        max: 50,
    },
    grupo:{
        type:String
    },
    semestre:{
        type:String
    },
    carrera:{
        type:String
    },
    encargado:{
        type:String
    }
},

{timestamps:true}
);

module.exports=mongoose.model("User",UserSchema)