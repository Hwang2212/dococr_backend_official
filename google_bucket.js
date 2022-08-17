import {Storage} from '@google-cloud/storage';
import path from 'path';

const gc = new Storage({
    keyFilename:   "winter-justice-358511-01d4c814d2cc.json",
    projectId: "winter-justice-358511"
})

 
const pdfFileBucket=gc.bucket('formpdf_bucket');


export const uploadPDFToGoogleDriveBucket = async (file) => {
    

    const {data} = await pdfFileBucket.upload(file, {

      });
    
      console.log("Uploaded to Bucket!");
    return data;
  };



