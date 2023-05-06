const express=require ("express");
const app=express();
const morgan=require("morgan");
const mongoose = require('mongoose');
const dotenv=require("dotenv");
const { default: helmet } = require("helmet");
const userRoute=require("./routes/users.js")
const authRoute=require("./routes/auth.js")
const postRoute=require("./routes/posts.js");
const conversationtRoute=require("./routes/conversations.js");
const messageRoute=require("./routes/messages.js");
const cors =require("cors");
const path=require("path")
const multer=require("multer")
const pdfParse=require("pdf-parse");
app.use(cors())

app.use("/assets", express.static(path.join(__dirname, "public/assets")));
app.use("/pdf", express.static('pdf'));

dotenv.config()

mongoose.connect(process.env.MONGO_URL, {useUnifiedTopology:true, useNewUrlParser: true});

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"))


const storage=multer.diskStorage({
  destination:(req,file,cb)=>{
      cb(null,"public/assets")
  },
  filename:(req, file, cb)=>{
      cb(null, req.body.name)
  }//antes file.originalname
});
const storage2=multer.diskStorage({
  destination:(req, file, cb)=>{
    cb(null,"pdf")
  },
  filename:(req, file, cb)=>{
    cb(null, req.body.name)
  }

})
const upload = multer({ storage: storage });
const upload2=multer()
const upload3=multer({storage: storage2})


app.post("/extract-text", upload2.array("pdfFile"), (req, res) => {
  // Verifica si hay archivos en la solicitud
  if (!req.files) {
    res.status(400);
    res.end();
  }

  // Procesa cada archivo PDF y extrae el texto
  const extractedTextPromises = req.files.map((pdfFile) =>
    pdfParse(pdfFile.buffer)
  );

  // Espera a que todos los archivos PDF sean procesados
  Promise.all(extractedTextPromises)
    .then((results) => {
      // Envía un arreglo con el texto extraído de cada archivo PDF
      res.send(results.map((result) => result.text));
    })
    .catch((error) => {
      console.error("Error al procesar archivos PDF:", error);
      res.status(500).send("Error al procesar archivos PDF");
    });
});

app.post('/upload', upload.single("file"), (req, res) => {
  try {
    console.log(req);
    res.status(200).json("Archivo guardado correctamente");
  } catch (error) {
    console.log(error);
    res.send(400);
  }
});

app.post('/upload2', upload3.single("file"), (req, res) => {
  try {
    console.log(req);
    res.status(200).json("Archivo guardado correctamente");
  } catch (error) {
    console.log(error);
    res.send(400);
  }
});
app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/posts", postRoute)
app.use("/api/conversations", conversationtRoute)
app.use("/api/messages", messageRoute)

const PORT =process.env.PORT || 9000;

app.listen(PORT, ()=>{
    console.log("Corriendo en el 9000");
})
