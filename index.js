const mongoose = require('mongoose')
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { questionRoutes }  = require('./routes');

const app = express();

mongoose.connect("mongodb://user:user123@ds159036.mlab.com:59036/euthing", { useNewUrlParser:true }, (err) => {
    console.log(err);
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use('/question', questionRoutes);

const port = 8000;

app.listen(port, () => { 
    console.log(`Serving on ${port}`);
});
