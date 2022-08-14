// const http = require('http'); //CommonJS style
import express from 'express';
import cors from 'cors';
import bodyParser from "body-parser";
import { upload } from './middleware/upload.js';
import {getCustomers,getCustomerByID,createCustomers, updateCustomerByID} from './customer.js';
import { getHealth, getHealthByID, getHealthByCustomerID, createHealth, updateHealthByID } from './health.js';
import multer from 'multer'; 
import { createUnderwrite } from './underwrite.js';



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

// Customer Routes
app.get('/customer', getCustomers)
app.get('/customer/:id', getCustomerByID)
app.post('/customer', upload.single("customer_ic_path"), createCustomers)
app.patch('/customer/:id', upload.single("customer_ic_path"), updateCustomerByID)

app.use(upload.array())
// Health Questionnaire Routes
app.get('/health', getHealth)
app.get('/health/:id', getHealthByID)
app.get('/health/customer/:cust_id', getHealthByCustomerID)
app.post('/health/customer/:cust_id', createHealth)
app.put('/health/customer/:cust_id/:id', updateHealthByID)


app.post('/underwrite', createUnderwrite)


app.listen(PORT, ()=> {
  console.log(`Server running on port http://localhost:${PORT}`)
});
