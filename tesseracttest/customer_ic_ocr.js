import Tesseract from "tesseract.js";

Tesseract.recognize(
    './uploads/bean.png',
    'eng',
    {
        logger: m => console.log(m)
    }).then(({data : {text}}) => {
        console.log(text);
    })
