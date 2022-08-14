import {pool} from './configs/db.js'


pool.on('error', ()=>{
  console.log("Error connecting to database");
})

// Get all health
export const getUnderwritingForm = (request,response) => {
    pool.query('SELECT * FROM healthquestion ORDER BY id ASC', (error,data)=>{
        if (error) {
            throw error
        }
        response.status(200).json(data.rows)
    })
}

// Get all health by customer id
export const getUnderwritingFormByCustomerID = (request,response) => {
    const cust_id = parseInt(request.params.cust_id)
    pool.query('SELECT * FROM healthquestion WHERE cust_id = $1',[cust_id], (error,data)=>{
        if (error) {
            throw error
        }
        response.status(200).json(data.rows)
    })
}

// Get health by id
export const getUnderwritingFormByID = (request,response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM healthquestion WHERE id = $1',[id], (error,data)=>{
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
        
    console.log(request.body);

    let health_query = await pool.query(`INSERT INTO healthquestion (uw_id, height, weight, current_ill, five_years_ill, hazardact, rejectinsurance, hiv, alcoholic, ancestral_ill, ancestral_desc, cust_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`, 
    [uw_id, height, weight, current_ill, five_years_ill, hazardact, rejectinsurance, hiv, alcoholic, ancestral_ill, ancestral_desc, cust_id], )
    
    response.status(200).send()


    
}

