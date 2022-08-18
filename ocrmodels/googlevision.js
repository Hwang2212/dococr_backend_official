// Imports the Google Cloud client library.
import vision from '@google-cloud/vision';
import  {CONFIG}  from '../configs/visionapi.js';
import {Storage} from '@google-cloud/storage';


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
  const bucketName = 'formpdf_bucket';
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

  let pageOne = textList[0]
  let pageTwo = textList[1]
  let pageThree = textList[2]
  let pageFour = textList[3]
  let pageFive = textList[4]
  let pageSix = textList[5]
  let pageSeven = textList[6]

/////////////////////////////////////////////////////////////////////////////////
  // Page One Data Processing
  let pageOneText = pageOne.split("\n");
  let pageOneTextList = [];
  for (let i = 0; i < pageOneText.length; i++) {
    if(pageOneText[i].includes('Product Name' || 'Nama Produk')){
      pageOneTextList.push(pageOneText[i+1])
    }
    else if (pageOneText[i].includes('Remarks' || 'Catat')) {
      pageOneTextList.push(pageOneText[i+1])
    }
    else if (pageOneText[i].includes('POLICY NO.' || 'NO. POLISI')) {
      pageOneTextList.push(pageOneText[i+1])
    }
    else if (pageOneText[i].includes('Product Code'||'Kod Produk')) {
      if (!isNaN(pageOneText[i].substr(-4))) {
        pageOneTextList.push(pageOneText[i].substr(-4))
      }else{pageOneTextList.push(pageOneText[i+1])} 
    }
    else if (pageOneText[i].includes('BANK IN SLIP NO.'||'NO. SLIP BANK DEPOSIT' || 'BANK IN SUP NO.')) {
      pageOneTextList.push(pageOneText[i+1])
    }
    else if (pageOneText[i] === 'Nama penuh (seperti dalam kad pengenalan)') {
      pageOneTextList.push(pageOneText[i+1])
    }
}
/////////////////////////////////////////////////////////////////////////////////
  // Page Two Data Processing
  let pageTwoText = pageTwo.split("\n");
  let pageTwoTextList = [];
  for (let i = 0; i < pageTwoText.length; i++) {
    pageTwoText[i]=pageTwoText[i].replaceAll(' ','')
    // pageTwoText.push(pageTwoText[i])
  }
  for (let i = 0; i < pageTwoText.length; i++) {
    if(pageTwoText[i].includes('NRIC' || 'pengenalan')){

      pageTwoText[i+1]=pageTwoText[i+1].replaceAll(' ','')
      pageTwoText[i+1]=pageTwoText[i+1].replaceAll('-','')
      // pageTwoText[i+1].replace('-','')
      pageTwoTextList.push(pageTwoText[i+1])
      break;
    }
  }
  for (let i = 0; i < pageTwoText.length; i++) {
    if(pageTwoText[i].includes('birth' || 'lahir')){

      pageTwoText[i+1]=pageTwoText[i+1].replaceAll(' ','')
      pageTwoText[i+1]=pageTwoText[i+1].replaceAll('-','')
      // pageTwoText[i+1].replace('-','')
      pageTwoTextList.push(pageTwoText[i+1])
      break;
    }
  }
  for (let i = 0; i < pageTwoText.length; i++) {
    if(pageTwoText[i].includes('Correspondence' || 'surat-menyurat')){
      pageTwoTextList.push(pageTwoText[i+1])
      break;
    }
  }
  // PostCode
  for (let i = 0; i < pageTwoText.length; i++) {
    if(!isNaN(pageTwoText[i].substr(0,4)) && pageTwoText[i].length == 5){
      pageTwoTextList.push(pageTwoText[i])
      break;
    }
  }
  for (let i = 0; i < pageTwoText.length; i++) {
    if(pageTwoText[i].includes('@' || '.com')){
      pageTwoTextList.push(pageTwoText[i])
      break;
    }
  }
  var regExp = /[a-zA-Z]/;
  for (let i = 0; i < pageTwoText.length; i++) {
    if(pageTwoText[i].includes(('Mobile') ||( 'bimbit'))){
      for(let j = i+1; i<j ; j++){
        if (!pageTwoText[j].includes('-')) {
          continue;
      }else{
        pageTwoTextList.push(pageTwoText[j])
        break;
      }
      
    }
    break;
  }
  
  }
  for (let i = 0; i < pageTwoText.length; i++) {
    if(pageTwoText[i].includes('Residence' ||'kediaman')){
      if (!pageTwoText[i+1].includes('-')) {
        continue;
      }else{
        pageTwoTextList.push(pageTwoText[i+1])
      }
      break;
    }
  }
  for (let i = 0; i < pageTwoText.length; i++) {
    if(pageTwoText[i].includes('Office' ||'pejabat')){
      if (!pageTwoText[i+1].includes('-')) {
        continue;
      }else{
        pageTwoTextList.push(pageTwoText[i+1])
      }
      break;
    }
  }
  for (let i = 0; i < pageTwoText.length; i++) {
    if(pageTwoText[i].includes('RM')){ 
        pageTwoTextList.push(pageTwoText[i])
      break;
    }
  }
  
/////////////////////////////////////////////////////////////////////////////////
  // Page Three Data Processing
  let pageThreeText = pageThree.split("\n");
  let pageThreeTextList = [];
  for (let i = 0; i < pageThreeText.length; i++) {
    pageThreeText[i]=pageThreeText[i].replaceAll(' ','')
    // pageTwoText.push(pageTwoText[i])
  }
  for (let i = 0; i < pageThreeText.length; i++) {
    if(pageThreeText[i].includes('duties' || 'Tanggungjawab')){
      pageThreeTextList.push(pageThreeText[i+1])
      break;
    }
  }
  for (let i = 0; i < pageThreeText.length; i++) {
    if(pageThreeText[i].includes('Nature' && 'business' || 'Jenis' && 'perniagaan')){
      pageThreeTextList.push(pageThreeText[i+1])
      break;
    }
  }
  for (let i = 0; i < pageThreeText.length; i++) {
    if(pageThreeText[i].includes(('addressofbusiness') || ('alamatperniagaan'))){
      pageThreeTextList.push(pageThreeText[i+1])
      break;
    }
  }
  for (let i = 0; i < pageThreeText.length; i++) {
    if(pageThreeText[i].includes(('Country') || ('Negara'))){
      pageThreeTextList.push(pageThreeText[i+1])
      break;
    }
  }
  for (let i = 0; i < pageThreeText.length; i++) {
    if(!isNaN(pageThreeText[i].substr(0,4)) && pageThreeText[i].length == 5){
      pageThreeTextList.push(pageThreeText[i])
      break;
    }
  }
/////////////////////////////////////////////////////////////////////////////////
  // Page Four Data Processing
  let pageFourText = pageFour.split("\n");
  let pageFourTextList = [];
  for (let i = 0; i < pageFourText.length; i++) {
    pageFourText[i]=pageFourText[i].replaceAll(' ','')
    // pageTwoText.push(pageTwoText[i])
  }
  for (let i = 0; i < pageFourText.length; i++) {
    if(pageFourText[i].includes('duties' || 'Tanggungjawab')){
      pageFourTextList.push(pageFourText[i+1])
      break;
    }
  }
  
console.log(pageFourText);
return pageFourTextList
}


let getText = await downloadIntoMemory().catch(console.error)
console.log(getText);

// Page 2 Return List:
// [
//   '221221321234',
//   '21011970',
//   'InMalaysia',
//    'POSTCODE',
//   'emasil@test.com',
//   '012-3456789',
//   '011-12345678',
//   '011-12345678',
//   'RM2000'
// ]

// Page 3 Return List:
// [ 'Job', 'Insurance', 'InMalaysia', 'Malaysia', '12345' ]


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
// let pageOne = extractedText.split("\n");

// // PDFParse is also a package to extract text directly from pdf files
// // let textObject = {};
// let newList = [];
// for (let i = 0; i < pageOne.length; i++) {
//   if(pageOne[i] === 'Product Name / Nama Produk'){
//     newList.push(pageOne[i+1])
//     console.log(pageOne[i+1]);
//     // return array[i+1]
//   }else if (pageOne[i] === 'Remarks/Catatan') {
//     newList.push(pageOne[i+1])
//   }else if (pageOne[i] === 'POLICY NO./NO. POLISI') {
//     newList.push(pageOne[i+1])
//   }else if (pageOne[i] === 'BANK IN SUP NO./NO. SLIP BANK DEPOSIT') {
//     newList.push(pageOne[i+1])
//   }else if (pageOne[i] === 'Nama penuh (seperti dalam kad pengenalan)') {
//     newList.push(pageOne[i+1])
//   }
// }
// // [ 'product_name: Product', 'remarks: Test is Important', 'policy_no: P0001', 'bank_slip_no: 120210321', 'customer_name: Customer' ]
// console.log(newList);