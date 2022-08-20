import { pool } from './configs/db.js'
import { uploadUWFormToGoogleDrive } from './googleDriveStorage/gs_uw_form.js';
import { uploadPDFToGoogleDriveBucket } from './google_bucket.js';
import { getJsonFile, visionPDFProcess } from './ocrmodels/googlevision.js';

export const uploadUnderwritingForm = async (request, response, next) => {

    let { file_name } = request.body


    var uw_filepath = "D:/DocOR/dococr_backend/uploads/" + request.file.filename;
    var uw_bucketuploadpath = "./uploads/" + request.file.filename;
    // Upload to Folder in Google Drive
    let uw_driveid = await uploadUWFormToGoogleDrive(request.file);
    let uw_bucket = await uploadPDFToGoogleDriveBucket(uw_bucketuploadpath);

    let ocrProcess = await visionPDFProcess(request.file.filename);
    let extractOCRText = await getJsonFile().catch(console.error);


    // Rearrange Data for Query List
    let customerList = [extractOCRText[0][5], extractOCRText[1][0], 0, '', extractOCRText[1][4], extractOCRText[1][5], '', '', '', extractOCRText[1][2] + ' ' + extractOCRText[1][4], extractOCRText[1][6], extractOCRText[1][7], parseInt(extractOCRText[1][8].substring(1)), extractOCRText[2][0], extractOCRText[2][1]]

    let customer_query = await pool.query(`INSERT INTO customer (customer_name, ic, age, gender, 
            email, phone_number, marital_status,race,nationality,corr_address,
            home_phone,office_phone,monthly_income,duties,business_nature) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`,
        customerList
    )
    const cust_id = customer_query.rows[0].id;

    let underwriteList = [extractOCRText[0][2], extractOCRText[0][0], extractOCRText[0][4], '', extractOCRText[0][1],
    extractOCRText[0][3], extractOCRText[3][0], extractOCRText[3][1], extractOCRText[3][2], extractOCRText[3][3],
        '', '', '', extractOCRText[4][0],
    extractOCRText[4][3], extractOCRText[4][2], extractOCRText[4][1], cust_id]

    let underwrite_query = await pool.query(`INSERT INTO underwrite_form (policy_no,product_name, product_code, staff_application, remarks, 
            bank_in_slipno, plan_name, plan_term, plan_sum_assured, plan_installment_premium, 
            premium_payment_freq, initial_payment_method, recurring_payment_method, bank_card_type, 
            bank_card_expiry, bank_card_issuer, bank_card_no, customer_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16, $17, $18) RETURNING *`,
        underwriteList
    )

    const uw_id = underwrite_query.rows[0].id;
    // [uw_id, height, weight, current_ill, five_years_ill, hazardact, rejectinsurance, hiv, alcoholic, ancestral_ill, ancestral_desc, cust_id]
    let healthList = [uw_id,parseInt(extractOCRText[4][4]),parseInt(extractOCRText[4][5]),'','','','','','','','', cust_id]

    // console.log(healthList);
    let health_query = await pool.query(`INSERT INTO healthquestion (uw_id, height, weight, current_ill, five_years_ill, hazardact, rejectinsurance, hiv, alcoholic, ancestral_ill, ancestral_desc, cust_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`, 
        healthList )



    pool.query(`INSERT INTO uw_form (file_name, uw_filepath, uw_driveid) VALUES ($1,$2,$3) RETURNING *`,
        [file_name, uw_filepath, uw_driveid],
        (error, data) => {
            if (error) {
                throw error
            }
        })
    
    response.status(200).json({"customer":customer_query.rows[0], "underwrite":underwrite_query.rows[0], "health":health_query.rows[0]})
    console.log(customer_query.rows[0]);
    console.log("Finished Sending Queries");

}
