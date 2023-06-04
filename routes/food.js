const Food=require("../models/Food");
const router=require("express").Router();
//Crear comida
router.post("/",async(req,res)=>{
    const newPost= new Food(req.body)
    try {
        const savedPost=await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err)        
    }
})
router.get("/:id", async(req, res)=>{
    try {
        const food= await Food.findById(req.params.id);
        res.status(200).json(food);
    } catch (err) {
        res.status(500).json(err)
        
    }
})
router.get("/all/food", async(req,res)=>{
    try{
        const food= await Food.find()
        res.status(200).json(food);
    }catch(err){
        res.status(500).json("Err " + err)
    }
})
router.delete("/:id", async (req,res)=>{
    try {
        const food = await Food.findById(req.params.id);
        console.log(req.body.userId);
            await food.deleteOne();
             res.status(200).json("Comida se ha eliminado");

    } catch (err) {
        res.status(500).json("Error" +err);
    }
});
router.put("/:id", async (req,res)=>{
    try {
        const food = await Food.findById(req.params.id);
            await food.updateOne({$set:req.body});
             res.status(200).json("La comida se modificó");
        

    } catch (err) {
        res.status(500).json("Error" +err);
    }
})

module.exports=router