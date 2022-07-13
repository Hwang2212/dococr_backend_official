import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const PORT = 5000;
const db = require('./queries')

app.use(bodyParser.json());


// Customer queries
app.get('/customers', db.getCustomers)
app.get('/customers/:id', db.getCustomersById)

app.get('/', (req, res)=> {
    res.send('Hello from Homepage.');
})

//Listen to Request
app.listen(PORT, ()=> console.log(`Server running on PORT: http://localhost:${PORT}`));