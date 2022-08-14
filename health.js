import {pool} from './configs/db.js'


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
    const cust_id = parseInt(request.params.cust_id)

    let {uw_id, height, weight, current_ill, five_years_ill, hazardact, rejectinsurance, hiv, alcoholic, ancestral_ill, ancestral_desc  } = request.body
        
    console.log(request.body);

    pool.query(`INSERT INTO healthquestion (uw_id, height, weight, current_ill, five_years_ill, hazardact, rejectinsurance, hiv, alcoholic, ancestral_ill, ancestral_desc, cust_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`, 
    [uw_id, height, weight, current_ill, five_years_ill, hazardact, rejectinsurance, hiv, alcoholic, ancestral_ill, ancestral_desc, cust_id], 
    (error, data)=>{
        if (error) {
            throw error
        }

        response.status(200).send(`Health Details added with Customer ID: ${data.rows[0].cust_id}`)
        var datas = data.rows[0] 
    })
}

// Create new customers
export const updateHealthByID = async (request, response) => {
    const id = parseInt(request.params.id)

    const cust_id = parseInt(request.params.cust_id)

    let {uw_id, height, weight, current_ill, five_years_ill, hazardact, rejectinsurance, hiv, alcoholic, ancestral_ill, ancestral_desc  } = request.body
        
    console.log(request.body);


    // Need to figure out how to get File ID from Google Drive and Post it to Supabase

    
    pool.query(`UPDATE healthquestion SET uw_id = $1, height = $2, weight = $3, current_ill = $4, 
    five_years_ill = $5, hazardact = $6, rejectinsurance = $7, hiv = $8, alcoholic = $9, ancestral_ill = $10,
    ancestral_desc = $11, cust_id = $12 WHERE id=$13`, 
    [uw_id, height, weight, current_ill, five_years_ill, hazardact, rejectinsurance, hiv, alcoholic, ancestral_ill, ancestral_desc, cust_id, id],  
    (error, data)=>{
        if (error) {
            console.log(error);
            throw error
        }
        response.status(200).send("Customer details changed")
        var datas = data.rows[0] 
    })
}