import {pool} from './configs/db.js'


pool.on('error', ()=>{
  console.log("Error connecting to database");
})

// Get all Underwriting Form
export const getUnderwritingForm = (request,response) => {
    pool.query('SELECT * FROM underwrite_form ORDER BY id ASC', (error,data)=>{
        if (error) {
            throw error
        }
        response.status(200).json(data.rows)
    })
}

// Get all Underwriting Form by customer id
export const getUnderwritingFormByCustomerID = (request,response) => {
    const cust_id = parseInt(request.params.cust_id)
    pool.query('SELECT * FROM underwrite_form WHERE customer_id = $1',[cust_id], (error,data)=>{
        if (error) {
            throw error
        }
        response.status(200).json(data.rows)
    })
}


export const createUnderwrite = async (request, response) => {
    let {customer_name, ic, age, gender, email, phone_number, marital_status,race,nationality,corr_address,
        home_phone,office_phone,monthly_income,duties,business_nature,  policy_no,product_name, product_code, staff_application, remarks, bank_in_slipno, plan_name, plan_term, plan_sum_assured, plan_installment_premium, premium_payment_freq, initial_payment_method, recurring_payment_method, bank_card_type, bank_card_expiry, bank_card_issuer, bank_card_no,      height, weight, current_ill, five_years_ill, hazardact, rejectinsurance, hiv, alcoholic, ancestral_ill, ancestral_desc  } = request.body

    // POSTING TO CUSTOMER TABLE
    let customer_query = await pool.query(`INSERT INTO customer (customer_name, ic, age, gender, 
        email, phone_number, marital_status,race,nationality,corr_address,
        home_phone,office_phone,monthly_income,duties,business_nature) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`, 
    [customer_name, ic, age, gender, email, phone_number, marital_status,race,nationality,corr_address,
        home_phone,office_phone,monthly_income,duties,business_nature]
    )
    const cust_id = customer_query.rows[0].id;

    let underwrite_query = await  pool.query(`INSERT INTO underwrite_form (policy_no,product_name, product_code, staff_application, remarks, 
        bank_in_slipno, plan_name, plan_term, plan_sum_assured, plan_installment_premium, 
        premium_payment_freq, initial_payment_method, recurring_payment_method, bank_card_type, 
        bank_card_expiry, bank_card_issuer, bank_card_no, customer_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16, $17, $18) RETURNING *`, 
    [policy_no,product_name, product_code, staff_application, remarks, 
        bank_in_slipno, plan_name, plan_term, plan_sum_assured, plan_installment_premium, 
        premium_payment_freq, initial_payment_method, recurring_payment_method, bank_card_type, 
        bank_card_expiry, bank_card_issuer, bank_card_no, cust_id]
    )
    
    const uw_id = underwrite_query.rows[0].id;
        

    let health_query = await pool.query(`INSERT INTO healthquestion (uw_id, height, weight, current_ill, five_years_ill, hazardact, rejectinsurance, hiv, alcoholic, ancestral_ill, ancestral_desc, cust_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`, 
    [uw_id, height, weight, current_ill, five_years_ill, hazardact, rejectinsurance, hiv, alcoholic, ancestral_ill, ancestral_desc, cust_id], )
    
    response.status(200).send()
}




export const updateUnderwriteByID = async (request, response) => {
    const cust_id = parseInt(request.params.cust_id)
    const health_id = parseInt(request.params.health_id)
    const underwrite_id = parseInt(request.params.underwrite_id)

    let {customer_name, ic, age, gender, email, phone_number, marital_status,race,nationality,corr_address,
        home_phone,office_phone,monthly_income,duties,business_nature,  policy_no,product_name, product_code, staff_application, remarks, bank_in_slipno, plan_name, plan_term, plan_sum_assured, plan_installment_premium, premium_payment_freq, initial_payment_method, recurring_payment_method, bank_card_type, bank_card_expiry, bank_card_issuer, bank_card_no,      
        height, weight, current_ill, five_years_ill, hazardact, rejectinsurance, hiv, alcoholic, ancestral_ill, ancestral_desc  } = request.body
    
    pool.query(`UPDATE customer SET customer_name = $1, ic = $2, age = $3, gender = $4, 
        email = $5, phone_number = $6, marital_status = $7, race = $8, nationality = $9, corr_address = $10,
        home_phone = $11, office_phone = $12, monthly_income = $13, duties = $14,business_nature = $15, customer_ic_path = $16, customer_ic_driveid = $17 WHERE id=$18`, 
    [customer_name, ic, age, gender, email, phone_number, marital_status,race,nationality,corr_address,
        home_phone,office_phone,monthly_income,duties,business_nature, '', '', cust_id], 
   )

   pool.query(`UPDATE healthquestion SET uw_id = $1, height = $2, weight = $3, current_ill = $4, 
   five_years_ill = $5, hazardact = $6, rejectinsurance = $7, hiv = $8, alcoholic = $9, ancestral_ill = $10,
   ancestral_desc = $11, cust_id = $12 WHERE id=$13`, 
   [underwrite_id, height, weight, current_ill, five_years_ill, hazardact, rejectinsurance, hiv, alcoholic, ancestral_ill, ancestral_desc, cust_id, health_id] )

   pool.query(`UPDATE underwrite_form SET policy_no = $1, product_name = $2, product_code = $3, staff_application = $4, 
   remarks = $5, bank_in_slipno = $6, plan_name = $7, plan_term = $8, plan_sum_assured = $9, plan_installment_premium = $10,
   premium_payment_freq = $11, initial_payment_method = $12 , recurring_payment_method = $13 , bank_card_type = $14, bank_card_expiry = $15, bank_card_issuer = $16
   , bank_card_no = $17, customer_id = $18 WHERE id=$19`, 
   [policy_no, product_name, product_code, staff_application, 
    remarks, bank_in_slipno, plan_name, plan_term, plan_sum_assured, plan_installment_premium, 
    premium_payment_freq, initial_payment_method, recurring_payment_method, bank_card_type, bank_card_expiry, bank_card_issuer, bank_card_no, cust_id, underwrite_id ] )

    response.status(200).send()
}


// Get all Underwriting Form by customer id
export const getPDFByCustomerID = (request,response) => {
    const cust_id = parseInt(request.params.cust_id)
    pool.query('SELECT * FROM uw_form WHERE cust_id = $1 ORDER BY id DESC LIMIT 1',[cust_id], (error,data)=>{
        if (error) {
            throw error
        }
        response.status(200).json(data.rows)
    })
}