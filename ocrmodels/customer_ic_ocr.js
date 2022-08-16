import Tesseract from "tesseract.js";

Tesseract.recognize(
    'D:/DocOCR/dococr_backend/customerpdf/customerpage1of7.jpg',
    'eng',
    {
        logger: m => console.log(m)
    }).then(({data : {text}}) => {
        console.log(text);
    })
