// const http = require('http'); //CommonJS style
import express from 'express';
import cors from 'cors';
import bodyParser from "body-parser";
import { upload } from './middleware/upload.js';
// import { uploadunderwrite } from './middleware/upload_underwrite.js';
import {getCustomers,getCustomerByID,createCustomers, updateCustomerByID} from './customer.js';
import { getHealth, getHealthByID, getHealthByCustomerID, createHealth, updateHealthByID } from './health.js';
import { createUnderwrite } from './underwrite.js';
import { uploadUnderwritingForm } from './upload_underwrite_form.js';



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

// app.use(upload.array())
// Health Questionnaire Routes
app.get('/health',upload.array(), getHealth)
app.get('/health/:id',upload.array(), getHealthByID)
app.get('/health/customer/:cust_id',upload.array(), getHealthByCustomerID)
app.post('/health/customer/:cust_id',upload.array(), createHealth)
app.put('/health/customer/:cust_id/:id',upload.array(), updateHealthByID)


app.post('/underwrite', createUnderwrite)

app.post('/underwrite/upload', upload.single("uw_filepath"),  uploadUnderwritingForm)

app.listen(PORT, ()=> {
  console.log(`Server running on port http://localhost:${PORT}`)
});
