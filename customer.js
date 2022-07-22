import pg from 'pg';

// Database Connection
const pool = new pg.Pool({
  user: 'postgres',
  host: 'db.jawezjhqjotikandcwbi.supabase.co',
  database: 'postgres',
  password: 'dococr2212!',
  port: 5432,
})

pool.on('error', ()=>{
  console.log("Error connecting to database");
})

// Get all customers
export const getCustomers = (request,response) => {
    pool.query('SELECT * FROM customer ORDER BY id ASC', (error,data)=>{
        if (error) {
            throw error
        }
        response.status(200).json(data.rows)
    })
}

// Get customer by id
export const getCustomerByID = (request,response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM customer WHERE id = $1',[id], (error,data)=>{
        if (error) {
            throw error
        }
        response.status(200).json(data.rows)
    })
}

// Create new customers
export const createCustomers = (request, response) => {

    let {customer_name, ic, age, gender, email, phone_number} = request.body
    pool.query(`INSERT INTO customer (customer_name, ic, age, gender, email, phone_number) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`, 
    [customer_name, ic, age, gender, email, phone_number], 
    (error, data)=>{
        if (error) {
            throw error
        }

        response.status(201).send(`Customer added with ID: ${data.rows[0].id}`)
        var datas = data.rows[0] 
    })
}