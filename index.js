// const http = require('http'); //CommonJS style
import express from 'express';
import cors from 'cors';
import bodyParser from "body-parser";
import {getCustomers,getCustomerByID,createCustomers} from './customer.js';

var app = express()
const PORT = 5000;
app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true,
}))

app.get('/', (request,response)=>{
  response.json({info: 'Node.js'})
})

app.get('/customer', getCustomers)
app.get('/customer/:id', getCustomerByID)
app.post('/customer', createCustomers)

app.listen(PORT, ()=> {
  console.log(`Server running on port http://localhost:${PORT}`)
});
