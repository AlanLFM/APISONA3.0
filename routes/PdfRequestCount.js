const router = require("express").Router();
const PdfRequestCount = require('../models/pdfRequestCount');

async function incrementRequestCount(filename) {
  const pdfRequestCount = await PdfRequestCount.findOne({ filename });

  if (pdfRequestCount) {
    pdfRequestCount.requestCount += 1;
    await pdfRequestCount.save();
  } else {
    await PdfRequestCount.create({ filename, requestCount: 1 });
  }
}

router.post('/incrementRequestCount', async (req, res) => {
  const { filename } = req.body;

  if (!filename) {
    res.status(400).json({ message: 'Filename is required' });
    return;
  }

  try {
    await incrementRequestCount(filename);
    res.status(200).json({ message: 'Request count incremented successfully' });
  } catch (error) {
    console.error('Error incrementing request count:', error);
    res.status(500).json({ message: 'Error incrementing request count' });
  }
});

router.get("/all", async(req,res)=>{
    try{
        const pdf= await PdfRequestCount.find()
        res.status(200).json(pdf);
    }catch(err){
        res.status(500).json("Err " + err)
    }
})

module.exports = router;
