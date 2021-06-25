const router = require('express').Router();
const Articles = require("../models/articles");
const bodyParser = require('body-parser');
const moment = require('moment-timezone');
const glob = require('glob');
const multer = require('multer');
const upload = multer({ dest: '/tmp' });
const path = require('path');
const fs = require('fs');

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

// post comment
router.patch("/api/article/comment/:id", async (req, res) => {
    try {
        const article = await Articles.updateOne(
            {_id: req.params.id},
            {
                $addToSet: {
                    comments: [
                      {
                        comment: String(req.body.comment),
                        from: String(req.body.username),
                      }
                    ]
                }
            })
        res.json(article);

    } catch (err) {
        res.json({
          message: err
        })
    }
})

// like or unlike article
router.patch("/api/article/like/:id", async (req, res) => {
    try {
        let article;
        if(req.body.action == "like"){
            article = await Articles.updateOne(
                {
                    _id: req.params.id,
                    likes: {$nin: req.body.user}
                },
                {
                    $addToSet: {
                        likes: [String(req.body.user)]
                    }
                })
        }else{
            article = await Articles.updateOne(
                {
                    _id: req.params.id,
                    likes: {$in: req.body.user}
                },
                {
                    $pull: {
                        likes: String(req.body.user)
                    }
                })
        }
        res.json(article);

    } catch (err) {
        res.json({
          message: err
        })
    }
})

// save or unsave article
router.patch("/api/article/save/:id", async (req, res) => {
    try {
        let article;
        if(req.body.action == "save"){
            article = await Articles.updateOne(
                {
                    _id: req.params.id,
                    saves: {$nin: req.body.user}
                },
                {
                    $addToSet: {
                        saves: [String(req.body.user)]
                    }
                })
        }else{
            article = await Articles.updateOne(
                {
                    _id: req.params.id,
                    saves: {$in: req.body.user}
                },
                {
                    $pull: {
                        saves: String(req.body.user)
                    }
                })
        }
        res.json(article);

    } catch (err) {
        res.json({
          message: err
        })
    }
})

// get article
router.get("/api/article/:id", async (req, res) => {
    try {
        let articles;
        articles = await Articles.find({_id: req.params.id}).limit(1);
        res.json(articles);
    } catch (err) {
        res.json({
            message: err
        })
    }
})

// get articles
router.get("/api/articles/:user?", async (req, res) => {
    try {
        let articles;
        if(req.params.user){
            articles = await Articles.find({user: {$ne: req.params.user}}).limit(5);
        }else{
            articles = await Articles.find();
        }
        res.json(articles);
    } catch (err) {
        res.json({
            message: err
        })
    }
})

// add article
router.post("/api/article/:user", upload.single('file'), (req, res) => {
    // upload files
    const date = moment().tz("Asia/Makassar").format('YYYYMMDDhhmmss');
    const fileName = req.params.user +"_" + date + path.extname(req.file.originalname)
    const file = path.join( process.cwd(), 'files/img/article', fileName)
    fs.rename(req.file.path, file, err => {
        err && console.log(err);
    })
    const article = new Articles({
      title: String(req.body.title),
      content: String(req.body.content),
      img: fileName,
      date: moment.tz("Asia/Makassar").format(),
      user: String(req.params.user),
      username: String(req.body.username)
    });

    article.save().then(article => res.json(article));
})

// edit article
router.put("/api/article/:id", async (req, res) => {
    try {
        const article = await Articles.updateOne(
            {_id: req.params.id},
            {$set: {
                title: String(req.body.title),
                content: String(req.body.content),
            }}
        )
        res.json(article);
      } catch (err) {
        res.json({
          message: err
        })
      }
})

// delete article
router.delete("/api/article/:id", async (req, res) => {
    try {
        await glob(`**/${req.body.img}*`, [],  (err, files) => {
                for (const file of files) {
                    const unlinkPath = path.join(process.cwd(), file);
                    fs.unlinkSync(unlinkPath);
                }
              })
        const article = await Articles.deleteOne({_id: req.params.id})
        res.json(article);

      } catch (err) {
        res.json({
          message: err
        })
      }
})

// get image
router.get('/api/articleImg/:id', (req, res) => {
    const img = path.join(process.cwd(), 'files/img/article', req.params.id);

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