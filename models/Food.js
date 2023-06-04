const mongoose=require("mongoose")
const FoodSchema=new mongoose.Schema(
    {
        comida:{
            type:String,
            required:true
        },
        img:{
            type:String,
            default: ""
        },
        precio:{
            type: Number,
            required:true
        },
        desc:{
            type: String,
            required: true
        }
    },
    {timestamps: true}
);

module.exports=mongoose.model("Food",FoodSchema)