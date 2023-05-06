const mongoose=require("mongoose")
const PostSchema=new mongoose.Schema(
    {
        userId:{
            type:String,
            required:true
        },
        asunto:{
            type: String,
            max: 100,
        },
        desc:{
            type: String,
            max: 500,
        },
        img:{
            type:String,
            default: ""
        },
        likes:{
            type:Array,
            default:[]
        },
        link:{
            type:String,
            default:""
        }
    },
    {timestamps: true}
);

module.exports=mongoose.model("Post",PostSchema)