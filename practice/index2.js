const express = require('express');
const multer = require('multer');
const app = express();
const crypto = require('crypto');
const path = require('path');
const ejs = require('ejs');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded());
app.set('view engine','ejs');
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public/uploads'));
// app.use(express.static(__dirname + '/uploads'));

app.listen(PORT,()=>{ console.log(`server is listen on the port ${PORT}`)});

let schema = mongoose.Schema({
    filename:String,
    filePath:String,
});

let images = new mongoose.model('images',schema);
let dblink = 'mongodb+srv://nodeApi:VKyOoLkKRBmU3awV@cluster0.mximo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';


mongoose.connect(dblink)
.then(()=>{
    console.log('database connected');
}).catch((err)=>{
    console.log('database not connected');
});

let storage = multer.diskStorage({
    destination: function(req,file,cb){
        // console.log(req.file);
        cb(null,'public/uploads');
    },
    filename:(req,file,cb) => {
        // console.log(req.file);
        console.log(file);
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }  
});

let upload = multer({storage});

app.post("/upload",upload.single('file'),async(req,res) => {
    // console.log(req.file);
    // console.log(req.body);
    console.log(req.file);
  try{
    let {filename,path} = req.file;
    console.log(req.file);
    // console.log(filename,path);
    let img = await images.create({filename,filePath:path});
    if(!img) return res.send("image is not uploaded");
    res.redirect('/');
  }catch(err){
      res.send(err);
  }
});

app.get('/images',async(req,res) => {
    try {
        let data = await images.find({});
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/',(req,res) => {
    res.render('index');
})
