// Imports the Google Cloud client library.
import vision from '@google-cloud/vision';
import  {CONFIG}  from '../configs/visionapi.js';



const client = new vision.ImageAnnotatorClient(CONFIG);


async function detectText(fileName) {
 
    // Performs text detection on the local file
    let [result] = await client.textDetection(fileName);
    // const detections = result.textAnnotations;
    // console.log('Text:');
    // detections.forEach(text => console.log(text));

    // console.log(result.fullTextAnnotation.text);
    // [END vision_text_detection]
    return result.fullTextAnnotation.text
  }

  const file = 'D:/DocOCR/dococr_backend/customerpdf/customerpage1of7.jpg';
  let extractedText = await detectText(file);


// Page 1 Data Processing
let newText = extractedText.split("\n");

// let textObject = {};
let newList = [];
for (let i = 0; i < newText.length; i++) {
  if(newText[i] === 'Product Name / Nama Produk'){
    newList.push(newText[i+1])
    console.log(newText[i+1]);
    // return array[i+1]
  }else if (newText[i] === 'Remarks/Catatan') {
    newList.push(newText[i+1])
  }else if (newText[i] === 'POLICY NO./NO. POLISI') {
    newList.push(newText[i+1])
  }else if (newText[i] === 'BANK IN SUP NO./NO. SLIP BANK DEPOSIT') {
    newList.push(newText[i+1])
  }else if (newText[i] === 'Nama penuh (seperti dalam kad pengenalan)') {
    newList.push(newText[i+1])
  }
}
// [ 'product_name: Product', 'remarks: Test is Important', 'policy_no: P0001', 'bank_slip_no: 120210321', 'customer_name: Customer' ]
console.log(newList);