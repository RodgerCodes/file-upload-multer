const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const mongoose = require('mongoose')
const pic = require('./models/gallery');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:false}))
mongoose.connect('mongodb://localhost/multer',{ useNewUrlParser: true },() => {
    console.log('Successfully connected to database')
})
const storage = multer.diskStorage({
    destination:'./public/upload',
    filename:(req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({
    storage:storage,
    fileFilter:(req, file, cb) => {
        checkFileType(file,cb)
    }
}).single('myimage');


const checkFileType = (file,  cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // mimetype
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null, true)
    }
    else{
        cb('Error: Images Only')
    }
}

app.set('view engine', 'ejs');
app.use(express.static('./public'))

app.get('/', (req, res) => res.render('index'));
app.post('/upload', (req, res) => {
    upload(req, res ,(err) => {
        if(err){
            res.render('index', {
                msg:err
            })
        }
        else{
            if(req.file == 'undefined'){
                res.render('index', {
                    msg:'Error:No file  selected'
                })
            }

            else{
             let fullpath = "upload/"+req.file.filename;
                const newphoto = new pic({
                    myimage:fullpath,
                    caption:req.body.caption
                })

                newphoto.save()
                .then(pic =>{
                    res.redirect('/gallery')
                })
                .catch(err => {
                    res.render('index', {
                      msg:err
                    })
                })
            }
        }
    })
});

app.get('/gallery',(req, res) => {
    pic.find()
    .then(photo => {
        res.render('gallery', {
            photolist:photo
        })
    })
    .catch(err => {
        msg:err
    })
})

const Port = 3000;
app.listen(Port, () => {
    console.log(`Server started on port ${Port}`)
})