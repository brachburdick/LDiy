const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const PORT = 3333;

const {json} = require('express')
app.use(cors());
const db = require('./models/entryModel.js');

//const { entryController } = require('./controllers/entryController.js');
app.use(express.json());
app.use(express.urlencoded({extended:true}));

console.log(path.join(__dirname,'..','dist'))
app.use(express.static(path.join(__dirname,'..','dist')));
app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname, 'index.html'))
})
//app.get('/',(req,res)=>res.status(200).sendFile(path.resolve(__dirname, '../client/index.html')));
app.get('/contact',
       (req,res)=>res.status(200).json({'test':'test'}))

app.get('/retrieve', (req,res)=>{
    console.log('@ /retrieve')
    db.query('SELECT * FROM entries')
    .then((data)=>{
        console.log('@ first .then()')
        console.log(data.rows)
        //console.log(data.json())
        
        res.locals.return = data.rows
        res.status(200).json({'response':'success'})})
    .catch(()=>({log:'error',message:'error In /retrieve', status:500}));
})
// //route error handler

app.get('*', (req,res)=>res.status(404).json({hello:'we\'ve been trying to reach you about your car\'s extended warranty'}));
//global error handler
app.use((err, req, res, next)=>{

  const GEH = {
    log: 'global error handler',
    message: `somewhere, a developer is about to get fired ` ,
    status: 500
  };
  Object.assign(GEH,err);
  res.status(GEH.status).json(GEH.message);
});

app.listen(PORT, ()=> console.log( 'listening on port ' + PORT));