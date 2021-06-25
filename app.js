const express = require('express');
const app = express();
const port = 3002;

const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require('cors');
const user = require('./route/user');
const transaction = require('./route/transaction');
const plan = require('./route/plan');
const article = require('./route/article');

app.use(cors())
app.use(bodyParser.json())
app.use(user)
app.use(transaction)
app.use(plan)
app.use(article)

app.get('/', (req, res) => {
  res.send(`Nabung API`);
})


//connect to mongodb
mongoose.connect(
  "mongodb+srv://nabung:nabung123@nabung1.dkgbr.mongodb.net/nabungdb?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.log("Db connected")
)

// static file
app.use(express.static('files/img'));  

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
})