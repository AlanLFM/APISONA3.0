const express=require ("express");
const app=express();
const morgan=require("morgan");
const mongoose = require('mongoose');
const dotenv=require("dotenv");
const cors =require("cors");
const http=require("http")
app.use(cors())


const { default: helmet } = require("helmet");
const userRoute=require("./routes/users.js")
const food=require("./routes/food.js")
const authRoute=require("./routes/auth.js")
const postRoute=require("./routes/posts.js");
const conversationtRoute=require("./routes/conversations.js");
const messageRoute=require("./routes/messages.js");
const PdfRequestCount=require("./routes/PdfRequestCount.js")
const path=require("path");
const fs=require("fs")
const multer=require("multer")
const pdfParse=require("pdf-parse");
const server=http.createServer(app);




app.use("/assets", express.static(path.join(__dirname, "public/assets")));
app.use("/pdf", express.static('pdf'));

dotenv.config()

mongoose.connect(process.env.MONGO_URL, {useUnifiedTopology:true, useNewUrlParser: true});
app.get('/files', (req, res) => {
  const folderPath = path.join(__dirname, 'pdf');

  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error('Error al leer el contenido de la carpeta:', err);
      res.status(500).send('Error al leer el contenido de la carpeta');
      return;
    }

    res.send(files);
  });
});
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
  if (!req.files) {
    res.status(400);
    res.end();
  }

  const extractedTextPromises = req.files.map((pdfFile) =>
    pdfParse(pdfFile.buffer)
  );

  Promise.all(extractedTextPromises)
    .then((results) => {
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

app.delete('/delete-file', (req, res) => {
  try {
    const fileName = req.body.fileName;
    const filePath = path.join(__dirname, 'pdf', fileName);
    fs.unlink(filePath, (error) => {
      if (error) {
        console.error('Error al eliminar el archivo:', error);
        res.status(500).json({ error: 'No se pudo eliminar el archivo.' });
      } else {
        console.log('Archivo eliminado correctamente:', fileName);
        res.status(200).json({ message: 'Archivo eliminado correctamente.' });
      }
    });
  } catch (error) {
    console.error('Error en la petición de eliminación de archivo:', error);
    res.status(400).json({ error: 'Error en la petición.' });
  }
});



app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/posts", postRoute)
app.use("/api/conversations", conversationtRoute)
app.use("/api/messages", messageRoute)
app.use("/api/pdfCount", PdfRequestCount)
app.use("/api/food", food)

const PORT =process.env.PORT || 9000;

server.listen(PORT, ()=>{
  console.log(`Corriendo en el puerto: ${PORT}`);
})

