import {pool} from './configs/db.js'
import {uploadICToGoogleDrive} from './googleDriveStorage/customer_ic.js'


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
        
    var customer_ic_path = "D:/DocOCR/dococr_backend/uploads/"+ request.file.filename;
    uploadICToGoogleDrive(request.file);

    console.log(request.body);
    pool.query(`INSERT INTO customer (customer_name, ic, age, gender, 
        email, phone_number, marital_status,race,nationality,corr_address,
        home_phone,office_phone,monthly_income,duties,business_nature,customer_ic_path) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`, 
    [customer_name, ic, age, gender, email, phone_number, marital_status,race,nationality,corr_address,
        home_phone,office_phone,monthly_income,duties,business_nature,customer_ic_path], 
    (error, data)=>{
        if (error) {
            throw error
        }

        response.status(200).send(`Customer added with ID: ${data.rows[0].id}`)
        var datas = data.rows[0] 
    })
}

// Create new customers
export const updateCustomerByID = (request, response) => {
    const id = parseInt(request.params.id)

    let {customer_name, ic, age, gender, email, phone_number, marital_status,race,nationality,corr_address,
        home_phone,office_phone,monthly_income,duties,business_nature} = request.body
    
    var customer_ic_path = "D:/DocOCR/dococr_backend/uploads/"+ request.file.filename;

    // Upload to Folder in Google Drive
    uploadICToGoogleDrive(request.file);

    // Need to figure out how to get File ID from Google Drive and Post it to Supabase

    console.log(customer_ic_path);
    pool.query(`UPDATE customer SET customer_name = $1, ic = $2, age = $3, gender = $4, 
        email = $5, phone_number = $6, marital_status = $7, race = $8, nationality = $9, corr_address = $10,
        home_phone = $11, office_phone = $12, monthly_income = $13, duties = $14,business_nature = $15, customer_ic_path = $16 WHERE id=$17`, 
    [customer_name, ic, age, gender, email, phone_number, marital_status,race,nationality,corr_address,
        home_phone,office_phone,monthly_income,duties,business_nature, customer_ic_path,id], 
    (error, data)=>{
        if (error) {
            console.log(error);
            throw error
        }
        response.status(200).send("Customer details changed")
        var datas = data.rows[0] 
    })
}