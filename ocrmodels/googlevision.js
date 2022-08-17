// Imports the Google Cloud client library.
import vision from '@google-cloud/vision';
import  {CONFIG}  from '../configs/visionapi.js';
import {Storage} from '@google-cloud/storage';
import { text } from 'body-parser';


// Configuration of Vision API to extract Text from PDF
const client = new vision.ImageAnnotatorClient(CONFIG);

export const visionPDFProcess = async (fileName) =>{// Bucket where the file resides
const bucketName = 'formpdf_bucket';
// Path to PDF file within bucket

const gcsSourceUri = `gs://${bucketName}/${fileName}`;
const gcsDestinationUri = `gs://${bucketName}/`;

const inputConfig = {
  // Supported mime_types are: 'application/pdf' and 'image/tiff'
  mimeType: 'application/pdf',
  gcsSource: {
    uri: gcsSourceUri,
  },
};
const outputConfig = {
  gcsDestination: {
    uri: gcsDestinationUri,
  },
};
const features = [{type: 'DOCUMENT_TEXT_DETECTION'}];
const request = {
  requests: [
    {
      inputConfig: inputConfig,
      features: features,
      outputConfig: outputConfig,
    },
  ],
};

const [operation] =await client.asyncBatchAnnotateFiles(request);
const [filesResponse] = await operation.promise();
}



// CONFIGURING FOR READING JSON FILE FROM GOOGLE DRIVE BUCKET

const jsonFile = 'output-1-to-7.json';
const storage = new Storage(CONFIG);

export const  downloadIntoMemory = async () =>  {
  // Downloads the file into a buffer in memory.
  const contents = await storage.bucket(bucketName).file(jsonFile).download();

  let newContent = JSON.parse(contents)
  let nContent = newContent["responses"]
  let pageNumbers = [];
  let textList = [];
  // Extracting Text and Page Numbers and then mapping two of them together as Key-Pair Value

  nContent.forEach(items => {
    
    // pageNumbers.push(items["context"]["pageNumber"]);
    textList.push(items["fullTextAnnotation"]["text"]);
    
  });
}


// let getText = await downloadIntoMemory().catch(console.error)




// Code Below: Detecting Text from Images
// async function detectText(fileName) {
 
//     // Performs text detection on the local file
//     let [result] = await client.textDetection(fileName);
//     // const detections = result.textAnnotations;
//     // console.log('Text:');
//     // detections.forEach(text => console.log(text));

//     // console.log(result.fullTextAnnotation.text);
//     // [END vision_text_detection]
//     return result.fullTextAnnotation.text
//   }
// const file = 'D:/DocOCR/dococr_backend/customerpdf/customerpage1of7.jpg';
// let extractedText = await detectText(file);


// // Page 1 Data Processing
// let newText = extractedText.split("\n");

// // PDFParse is also a package to extract text directly from pdf files
// // let textObject = {};
// let newList = [];
// for (let i = 0; i < newText.length; i++) {
//   if(newText[i] === 'Product Name / Nama Produk'){
//     newList.push(newText[i+1])
//     console.log(newText[i+1]);
//     // return array[i+1]
//   }else if (newText[i] === 'Remarks/Catatan') {
//     newList.push(newText[i+1])
//   }else if (newText[i] === 'POLICY NO./NO. POLISI') {
//     newList.push(newText[i+1])
//   }else if (newText[i] === 'BANK IN SUP NO./NO. SLIP BANK DEPOSIT') {
//     newList.push(newText[i+1])
//   }else if (newText[i] === 'Nama penuh (seperti dalam kad pengenalan)') {
//     newList.push(newText[i+1])
//   }
// }
// // [ 'product_name: Product', 'remarks: Test is Important', 'policy_no: P0001', 'bank_slip_no: 120210321', 'customer_name: Customer' ]
// console.log(newList);