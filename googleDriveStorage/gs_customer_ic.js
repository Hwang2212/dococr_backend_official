import {driveService} from '../middleware/googleservice.js';
import { customerICDrive } from '../configs/gdrivefolder.js';
import {Stream} from 'stream';
import * as fs from 'fs';



export const uploadICToGoogleDrive = async (file) => {

    const { data } = await driveService.files.create({
      media: {
        mimeType: file.mimeType,
        body: fs.createReadStream(`D:/DocOCR/dococr_backend/uploads/${file.originalname}`),
      },
      requestBody: {
        name: file.originalname,
        parents: [customerICDrive], // All Drive Folder ID stored in /configs/gdrivefolder.js
      },
      fields: 'id,name',
    });

    return data.id;
  };
