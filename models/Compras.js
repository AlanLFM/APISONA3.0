const mongoose=require("mongoose")
const ComprasSchema=new mongoose.Schema(
    {
        compraId:{
            type:String,
            required:true
        },
        compradorId:{
            type:String,
            required:true
        },
        orden:{
            type:Array,
        },
    },
    {timestamps: true}
);

module.exports=mongoose.model("Compras",ComprasSchema)