/* ==================================================
Import Node modules
===================================================*/
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const path = require('path');
// const cors = require('cors');
const bodyParser = require('body-parser');

const config = require('./config/database');
const authentication = require('./routes/authentication')(router);
const blogs = require('./routes/blogs')(router);

// vars
const app = express();
const port = process.env.PORT || 8080;

mongoose.connect(config.uri, (error) => {
    if(error){
        console.log(error);
    }else{
        console.log('connected to database: '+config.db);
    }
}); 


/* ==================================================
Middlewares
===================================================*/
// cors middleware
// app.use(cors({
//     origin: 'http://localhost:4200'
// }));
// bodyparser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// static folder
app.use(express.static(__dirname+'/public'));
// authentication route
app.use('/authentication',authentication);
app.use('/blogs',blogs);

// connect to index html in angular 2
app.get('*',(req, res)=>{
    res.sendFile(path.join(__dirname+'/public/index.html'));
});

/* ==================================================
server
===================================================*/
app.listen(port, ()=>{
    console.log('listening on port: '+port);
});