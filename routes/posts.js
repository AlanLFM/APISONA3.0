const router=require("express").Router();
const Post=require("../models/Post")
const User=require("../models/User")

//Crear post
router.post("/",async(req,res)=>{
    const newPost= new Post(req.body)
    try {
        const savedPost=await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err)        
    }
})


//Modificar post
    router.put("/:id", async (req,res)=>{
        try {
            const post = await Post.findById(req.params.id);
            if(post.userId === req.body.userId){
                await post.updateOne({$set:req.body});
                 res.status(200).json("El post se modificó");
            }else{
                res.status(403).json("Sólo puedes modificar tu post")
            }

        } catch (err) {
            res.status(500).json("Error" +err);
        }
    })

//Eliminar
router.delete("/:id", async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        console.log(req.body.userId);
        if(post.userId === req.body.userId){
            await post.deleteOne();
             res.status(200).json("El post se ha eliminado");
        }else{
            res.status(403).json("Sólo puedes eliminar tu post")
        }

    } catch (err) {
        res.status(500).json("Error" +err);
    }
});

//Get
router.get("/:id", async(req, res)=>{
    try {
        const post= await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err)
        
    }
})

//GetSaved
router.get("/savedpost/:userId", async (req,res)=>{
    try { 
        const currentUser= await User.findById(req.params.userId);
        const userPosts= await Post.find({userId: currentUser.saved});
        const friendPosts = await Promise.all(
        currentUser.saved.map((saved)=>{
            return Post.find({_id: saved});
        })
        );
        res.status(200).json(userPosts.concat(...friendPosts))
    } catch (err) {
        res.status(500).json("Err" +err)
    }
})

//Obtener todos los posts de un user
router.get("/profile/:username", async (req,res)=>{
    try { 
        const user=await User.findOne({username:req.params.username})
        const posts= await Post.find({userId: user._id});
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json("Err" +err)
    }
})

//Obtener todos los post
router.get("/all/posts", async(req,res)=>{
    try{
        const post= await Post.find()
        res.status(200).json(post);
    }catch(err){
        res.status(500).json("Err " + err)
    }
})

module.exports=router;
