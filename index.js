// const http = require('http'); //CommonJS style
import express from 'express';
import cors from 'cors';
import bodyParser from "body-parser";
import {getCustomers,getCustomerByID,createCustomers, updateCustomerByID} from './customer.js';
import { upload } from './middleware/upload.js';




export var app = express()
const PORT = 5000;
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true,
}))
console.log();



app.get('/', (request,response)=>{
  response.json({info: 'Node.js'})
})

app.get('/customer', getCustomers)
app.get('/customer/:id', getCustomerByID)
app.post('/customer', upload.single("customer_ic_path"), createCustomers)
app.put('/customer/:id', upload.single("customer_ic_path"), updateCustomerByID)

app.listen(PORT, ()=> {
  console.log(`Server running on port http://localhost:${PORT}`)
});
