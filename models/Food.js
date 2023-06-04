const mongoose=require("mongoose")
const FoodSchema=new mongoose.Schema(
    {
        foodId:{
            type:String,
            required:true
        },
        comida:{
            type:String,
            required:true
        },
        precio:{
            type:Int,
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