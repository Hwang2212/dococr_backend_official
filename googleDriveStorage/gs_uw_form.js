import {driveService} from '../middleware/googleservice.js';
import { underwritingFormDrive } from '../configs/gdrivefolder.js';
import {Stream} from 'stream';
import * as fs from 'fs';



export const uploadUWFormToGoogleDrive = async (file) => {

    const { data } = await driveService.files.create({
      media: {
        mimeType: file.mimeType,
        body: fs.createReadStream(`D:/DocOCR/dococr_backend/uploads/${file.originalname}`),
      },
      requestBody: {
        name: file.originalname,
        parents: [underwritingFormDrive], // All Drive Folder ID stored in /configs/gdrivefolder.js
      },
      fields: 'id,name',
    });
    // console.log(`Uploaded file ${data.name} ${data.id}`);
    // console.log(data.id);
    return data.id;
  };
