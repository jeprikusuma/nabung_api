const router = require('express').Router();
const fire = require('../config/fire');
const bodyParser = require('body-parser');
const moment = require('moment-timezone');
// const fetch = require("node-fetch");
const bcrypt = require('bcryptjs');
const db = fire.firestore();
const user = db.collection('users');
const glob = require('glob');
const multer = require('multer');
const upload = multer({ dest: '/tmp' });
const path = require('path');
const fs = require('fs');

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

// registrasi
router.post('/api/register', async (req, res) => {
    const validate = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if(validate.test(req.body.email)){
        const getUser = await user.where("email", "==", String(req.body.email)).get();
        
        if(getUser.size > 0){
            res.status(400).send('Email telah terdaftar');
        }else{
            const register = await user.add({
                email: String(req.body.email),
                name: String(req.body.name),
                password: String(bcrypt.hashSync(req.body.password, 10)),
                date: moment.tz("Asia/Makassar").format(),
                profile: 'default_user.png',
                saving: 0,
                lastTransaction: null
            });
            res.send(register.id)
        }
    }else{
        res.status(400).send('Email tidak valid!');
    }
    res.end();
})
// login
router.post('/api/login', async (req, res) => {
    const getUser = await user.where("email", "==", String(req.body.email)).get();
    
    if(getUser.size == 0){
        res.status(400).send('Email atau Password salah!');
    }else{
        let id, password;
        getUser.forEach(doc => {
            id = doc.id;
            password = doc.data().password;
        });

        if(bcrypt.compareSync(req.body.password, password)){
            res.status(200).send(id);
        }else{
            res.status(400).send('Email atau Password salah!');
        }
    }
    res.end();
})
// change name
router.post('/api/change/name/:id', async (req, res) => {
    const userRef = user.doc(req.params.id);
    // const doc = await userRef.get();
    
    // if (!doc.exists){
        //     res.status(400).send('Pengguna tidak ditemukan!');
        // } else{
    // }
    try{
        await userRef.update({
            name: String(req.body.name)
        });
        res.send(true);
    }catch(e){
        res.status(400).send("Gagal saat update!");
    }

    res.end();
})
// change password
router.post('/api/change/password/:id', async (req, res) => {
    const userRef = user.doc(req.params.id);

    if(req.body.password == req.body.confirm){
        try{
            await userRef.update({
                password: String(bcrypt.hashSync(req.body.password, 10))
            });
            res.send("Berhasil");
        }catch(e){
            res.status(400).send("Gagal saat update!");
        }
    }else{
        res.status(400).send("Password dan konfirmasi password tidak sama!");
    }

    res.end();
})
// change profile
router.post('/api/change/profile/:id', upload.single('file'), async (req, res) => {
    // delete files
    let checkDelete = new Promise((acc, rej) => {
        glob(`**/${req.params.id}*`, [],  (err, files) => {
            for (const file of files) {
                const unlinkPath = path.join(process.cwd(), file);
                fs.unlinkSync(unlinkPath);
            }
            acc(true);
        })

    })
    await checkDelete;
    // upload files
    const date = moment().tz("Asia/Makassar").format('YYYYMMDDhhmmss');
    const fileName = req.params.id +"_" + date + path.extname(req.file.originalname)
    const file = path.join( process.cwd(), 'files/img/user', fileName)
    fs.rename(req.file.path, file, err => {
        err && console.log(err);
    })
    
    // update db
    const userRef = user.doc(req.params.id);
    await userRef.update({
        profile: String(fileName)
    });
    
    res.send(true);
    res.end();
})
// get profile
router.get('/api/profile/:id', (req, res) => {
    const img = path.join(process.cwd(), 'files/img/user', req.params.id);

    fs.readFile(img, (err, content) => {
        if(err){
            res.end();
        }else{
            res.writeHead(200, {"Content-type": "image/jpg"});
            res.end(content);
        }
    })
})
//exports
module.exports = router