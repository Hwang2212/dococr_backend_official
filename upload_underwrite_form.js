import {pool} from './configs/db.js'
import { uploadUWFormToGoogleDrive } from './googleDriveStorage/gs_uw_form.js';

export const uploadUnderwritingForm = async (request, response) => {

    let {file_name} = request.body
    
    console.log(request.file.filename);
    var uw_filepath = "D:/DocOR/dococr_backend/underwritingforms/"+ request.file.filename;

    // Upload to Folder in Google Drive
    let uw_driveid = await uploadUWFormToGoogleDrive(request.file);

    // Need to figure out how to get File ID from Google Drive and Post it to Supabase

    
    pool.query(`INSERT INTO uw_form (file_name, uw_filepath, uw_driveid) VALUES ($1,$2,$3) RETURNING *`, 
    [file_name, uw_filepath, uw_driveid], 
    (error, data)=>{
        if (error) {
            throw error
        }

        response.status(200).send(`Customer added with ID: ${data.rows[0].id}`)
        var datas = data.rows[0] 
    })
}