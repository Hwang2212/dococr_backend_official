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