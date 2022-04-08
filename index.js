const express =  require('express');
const authRouter =  require("./auth/auth");
const {protectedRoute} = require('./controllers/controller');
const imageRouter =  require('./routes/routes');
const dotenv = require('dotenv');
let mongoose = require('mongoose');
let multer = require('multer');
let images = require('./models/images');
const ejs = require('ejs');
const path = require('path');
const cookieParser = require("cookie-parser");

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();
app.use(cookieParser());
app.listen(PORT,() => {console.log(`server is listening on the port ${PORT}`)});

mongoose.connect(process.env.MONGO_URL)
.then(() => {console.log('database connected');})
.catch((err) => {
    console.log('database not connected');
});

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + "/public"))

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set('view engine','ejs');

let storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'public/images');
    },
    filename:function(req,file,cb){
        cb(null,file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});

let upload = multer({storage});

app.post('/upload',protectedRoute,upload.single('myfile'),async(req,res) => {
    console.log(req.file);
    try {
        let {filename} = req.file;
        let image = await images.create({filename});
        res.redirect('/');
    } catch (error) {
        res.status(500).send(error);
    }
});

// app.post('/update',protectedRoute,authRouter);

app.get('/images', async(req,res) => {
    try {
        let imgs = await images.find({});
        res.status(200).send(imgs);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.use('/auth',authRouter);
app.use('/upload',protectedRoute,imageRouter);

app.use('/',(req,res) => {
    res.render('index');
})

