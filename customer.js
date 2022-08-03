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

    let {customer_name, ic, age, gender, email, phone_number, marital_status,race,nationality,corr_address,
        home_phone,office_phone,monthly_income,duties,business_nature} = request.body
    console.log(request.body);
    pool.query(`INSERT INTO customer (customer_name, ic, age, gender, 
        email, phone_number, marital_status,race,nationality,corr_address,
        home_phone,office_phone,monthly_income,duties,business_nature) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`, 
    [customer_name, ic, age, gender, email, phone_number, marital_status,race,nationality,corr_address,
        home_phone,office_phone,monthly_income,duties,business_nature], 
    (error, data)=>{
        if (error) {
            throw error
        }

        response.status(201).send(`Customer added with ID: ${data.rows[0].id}`)
        var datas = data.rows[0] 
    })
}

// Create new customers
export const updateCustomerByID = (request, response) => {
    const id = parseInt(request.params.id)

    let {customer_name, ic, age, gender, email, phone_number, marital_status,race,nationality,corr_address,
        home_phone,office_phone,monthly_income,duties,business_nature} = request.body
    console.log(request.body);
    pool.query(`UPDATE customer SET customer_name = $1, ic = $2, age = $3, gender = $4, 
        email = $5, phone_number = $6, marital_status = $7, race = $8, nationality = $9, corr_address = $10,
        home_phone = $11, office_phone = $12, monthly_income = $13, duties = $14,business_nature = $15`, 
    [customer_name, ic, age, gender, email, phone_number, marital_status,race,nationality,corr_address,
        home_phone,office_phone,monthly_income,duties,business_nature], 
    (error, data)=>{
        if (error) {
            throw error
        }

        response.status(201).send(`Customer added with ID: ${data.rows[0].id}`)
        var datas = data.rows[0] 
    })
}