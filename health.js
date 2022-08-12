import {pool} from './configs/db.js'
import {uploadICToGoogleDrive} from './googleDriveStorage/customer_ic.js'


pool.on('error', ()=>{
  console.log("Error connecting to database");
})

// Get all health
export const getHealth = (request,response) => {
    pool.query('SELECT * FROM healthquestion ORDER BY id ASC', (error,data)=>{
        if (error) {
            throw error
        }
        response.status(200).json(data.rows)
    })
}

// Get all health by customer id
export const getHealthByCustomerID = (request,response) => {
    const cust_id = parseInt(request.params.cust_id)
    pool.query('SELECT * FROM healthquestion WHERE cust_id = $1',[cust_id], (error,data)=>{
        if (error) {
            throw error
        }
        response.status(200).json(data.rows)
    })
}

// Get health by id
export const getHealthByID = (request,response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM healthquestion WHERE id = $1',[id], (error,data)=>{
        if (error) {
            throw error
        }
        response.status(200).json(data.rows)
    })
}
export const createHealth = async (request, response) => {

    let {} = request.body
        

    // uploadGDrive.then((result)=>{
    //     var customer_ic_driveid = result
    //     return customer_ic_driveid
    //     // https://drive.google.com/uc?id=FILE_ID
    // });


    // console.log(request.body);
    pool.query(`INSERT INTO healthquestion () VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16, $17) RETURNING *`, 
    [customer_name, ic, age, gender, email, phone_number, marital_status,race,nationality,corr_address,
        home_phone,office_phone,monthly_income,duties,business_nature,customer_ic_path, customer_ic_driveid], 
    (error, data)=>{
        if (error) {
            throw error
        }

        response.status(200).send(`Customer added with ID: ${data.rows[0].id}`)
        var datas = data.rows[0] 
    })
}

// Create new customers
export const updateHealthByID = async (request, response) => {
    const id = parseInt(request.params.id)

    let {customer_name, ic, age, gender, email, phone_number, marital_status,race,nationality,corr_address,
        home_phone,office_phone,monthly_income,duties,business_nature} = request.body
    
    console.log(request.file.filename);
    var customer_ic_path = "D:/DocOR/dococr_backend/uploads/"+ request.file.filename;

    // Upload to Folder in Google Drive
    let customer_ic_driveid = await uploadICToGoogleDrive(request.file);

    // Need to figure out how to get File ID from Google Drive and Post it to Supabase

    
    pool.query(`UPDATE customer SET customer_name = $1, ic = $2, age = $3, gender = $4, 
        email = $5, phone_number = $6, marital_status = $7, race = $8, nationality = $9, corr_address = $10,
        home_phone = $11, office_phone = $12, monthly_income = $13, duties = $14,business_nature = $15, customer_ic_path = $16, customer_ic_driveid = $17 WHERE id=$18`, 
    [customer_name, ic, age, gender, email, phone_number, marital_status,race,nationality,corr_address,
        home_phone,office_phone,monthly_income,duties,business_nature, customer_ic_path, customer_ic_driveid, id], 
    (error, data)=>{
        if (error) {
            console.log(error);
            throw error
        }
        response.status(200).send("Customer details changed")
        var datas = data.rows[0] 
    })
}