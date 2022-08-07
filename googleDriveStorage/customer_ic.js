import {driveService} from '../middleware/googleservice.js';
import { customerICDrive } from '../configs/gdrivefolder.js';
import {Stream} from 'stream';



export const uploadICToGoogleDrive = async (file) => {
    const bufferStream = new Stream.PassThrough();
    bufferStream.end(file.buffer);
    const { data } = await driveService.files.create({
      media: {
        mimeType: file.mimeType,
        body: bufferStream,
      },
      requestBody: {
        name: file.originalname,
        parents: [customerICDrive], // All Drive Folder ID stored in /configs/gdrivefolder.js
      },
      fields: 'id,name',
    });
    console.log(`Uploaded file ${data.name} ${data.id}`);
  };
