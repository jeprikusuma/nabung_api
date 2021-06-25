const router = require('express').Router();
const bodyParser = require('body-parser');
const Plans = require("../models/plans");

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))


// get plans
router.get("/api/plan/:user/:limit?", async (req, res) => {
    try {
      let plans;
      if(req.params.limit == 'limit'){
        plans = await Plans.find({user: req.params.user,isDone: 0}).sort({_id:-1}).limit(3);
      }else if(req.params.limit == 'done'){
        plans = await Plans.find({user: req.params.user,isDone: 1}).sort({_id:-1});
      }else{
        plans = await Plans.find({user: req.params.user, isDone: 0}).sort({_id:-1});
      }
      res.json(plans);
    } catch (err) {
      res.json({
        message: err
      })
    }
})

// add plan
router.post("/api/plan/:user",  (req, res) => {
    const plan = new Plans({
      title: String(req.body.title),
      content: String(req.body.content),
      theme: String(req.body.theme),
      status: String(req.body.status),
      date: String(req.body.date),
      nominal: parseInt(req.body.nominal),
      user: String(req.params.user),
      isDone: 0
    });

    plan.save().then(plan => res.json(plan));
})

// set plan done
router.patch("/api/plan/:id", async (req, res) => {
    try {
        const plan = await Plans.updateOne(
            {_id: req.params.id},
            {$set: {
                isDone: 1
            }}
        )

        res.json(plan);
      } catch (err) {
        res.json({
          message: err
        })
      }
})

// update plan
router.put("/api/plan/:id", async (req, res) => {
    try {
        const plan = await Plans.updateOne(
            {_id: req.params.id},
            {$set: {
                title: String(req.body.title),
                content: String(req.body.content),
                theme: String(req.body.theme),
                status: String(req.body.status),
                date: String(req.body.date),
                nominal: parseInt(req.body.nominal)
            }}
        )
        res.json(plan);
      } catch (err) {
        res.json({
          message: err
        })
      }
})

// delete plan
router.delete("/api/plan/:id", async (req, res) => {
    try {
        const plan = await Plans.deleteOne({_id: req.params.id})
        res.json(plan);

      } catch (err) {
        res.json({
          message: err
        })
      }
})

//exports
module.exports = router