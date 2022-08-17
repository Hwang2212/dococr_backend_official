import {pool} from './configs/db.js'
import { uploadUWFormToGoogleDrive } from './googleDriveStorage/gs_uw_form.js';
import { uploadPDFToGoogleDriveBucket } from './google_bucket.js';
import { downloadIntoMemory, visionPDFProcess } from './ocrmodels/googlevision.js';

export const uploadUnderwritingForm = async (request, response, next) => {

    let {file_name} = request.body
    
    console.log(request.file.filename);
    var uw_filepath = "D:/DocOR/dococr_backend/uploads/"+ request.file.filename;
    var uw_bucketuploadpath = "./uploads/"+request.file.filename;
    // Upload to Folder in Google Drive
    let uw_driveid = await uploadUWFormToGoogleDrive(request.file);
    let uw_bucket = await uploadPDFToGoogleDriveBucket(uw_bucketuploadpath);
    
    let ocrProcess = await visionPDFProcess(request.file.filename);
    let extractOCRText = await downloadIntoMemory().catch(console.error);


    
    pool.query(`INSERT INTO uw_form (file_name, uw_filepath, uw_driveid) VALUES ($1,$2,$3) RETURNING *`, 
    [file_name, uw_filepath, uw_driveid], 
    (error, data)=>{
        if (error) {
            throw error
        }
        next()
        response.status(200).send(`Customer added with ID: ${data.rows[0].id}`)
    })

    // Upload to Google Storage Bucket for Google Vision API to retrieve data
    // Delay Calling this function because upload havent finish uploading to local storage
    

}