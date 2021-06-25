const router = require('express').Router();
const fire = require('../config/fire');
const bodyParser = require('body-parser');
const moment = require('moment-timezone');
const db = fire.firestore();
const user = db.collection('users');
const transaction = db.collection('transactions');
const graph = db.collection('graph');


router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

// add transaction
router.post('/api/transaction/add/:id', async (req, res) => {
    // add transaction data
    const transData = await transaction.add({
        user: String(req.params.id),
        title: String(req.body.title),
        status: String(req.body.status),
        date: moment.tz("Asia/Makassar").format(),
        nominal: parseInt(req.body.nominal)
    });

    // update saving
    const userRef = user.doc(req.params.id);
    const userData = await userRef.get();
    await userRef.update({
        saving: req.body.status == "Up" ? parseInt(userData.data().saving) + parseInt(req.body.nominal) : 
                parseInt(userData.data().saving) - parseInt(req.body.nominal),
        lastTransaction: {
            nominal: req.body.nominal,
            status: req.body.status,
            date: moment.tz("Asia/Makassar").format()
            },
    });

    // update graph
    const date = new Date(moment.tz("Asia/Makassar").format());
    const key = `${date.getMonth() + 1}-${date.getFullYear()}`;
    const graphs = await graph.doc(req.params.id).get();
    let status = false;
    let value = 0;

    if(graphs.exists){
        const graphsVal = graphs.data();

        if(key in graphsVal){
            status = true;
            value = parseInt(graphsVal[key]);
        }
    }

    if(status){
        await graph.doc(req.params.id).set({
            [key]: req.body.status == "Up" ? parseInt(value) + parseInt(req.body.nominal) : 
            parseInt(value) - parseInt(req.body.nominal),
        },
        { merge: true });
    }else{
        await graph.doc(req.params.id).set({
            [key]: parseInt(req.body.nominal),
        },
        { merge: true });
    }

    res.send(transData.id)
    res.end();
})

// delete transaction
router.get('/api/transaction/delete/:id/:trans', async (req, res) => {
    // get data transaction
    const transRef = transaction.doc(req.params.trans);
    const transData = await transRef.get();

    // update saving
    const userRef = user.doc(req.params.id);
    const userData = await userRef.get();
    await userRef.update({
        saving: transData.data().status == "Up" ? parseInt(userData.data().saving) - parseInt(transData.data().nominal) : 
                parseInt(userData.data().saving) + parseInt(transData.data().nominal),
    });

    // update graph
    const date = new Date(transData.data().date);
    const key = `${date.getMonth() + 1}-${date.getFullYear()}`;
    const graphs = await graph.doc(req.params.id).get();
    let status = false;
    let value = 0;

    if(graphs.exists){
        const graphsVal = graphs.data();

        if(key in graphsVal){
            status = true;
            value = parseInt(graphsVal[key]);
        }
    }

    if(status){
        await graph.doc(req.params.id).set({
            [key]: transData.data().status == "Up" ? parseInt(value) - parseInt(transData.data().nominal) : 
            parseInt(value) + parseInt(transData.data().nominal),
        },
        { merge: true });
    }else{
        await graph.doc(req.params.id).set({
            [key]: parseInt(transData.data().nominal),
        },
        { merge: true });
    }

    await transRef.delete();
    res.send(transData.id)
    res.end();
})


router.patch('/api/graph/:id', async (req, res) => {
    const date = new Date(req.body.date);
    const key = `${date.getMonth() + 1}-${date.getFullYear()}`;
    const graphs = await graph.doc(req.params.id).get();
    let status = false;
    let value = 0;

    if(graphs.exists){
        const graphsVal = graphs.data();

        if(key in graphsVal){
            status = true;
            value = parseInt(graphsVal[key]);
        }
    }

    if(status){
        await graph.doc(req.params.id).set({
            [key]: parseInt(req.body.nominal) + value,
        },
        { merge: true });
    }else{
        await graph.doc(req.params.id).set({
            [key]: parseInt(req.body.nominal),
        },
        { merge: true });
    }



    res.send(true)
})

//exports
module.exports = router