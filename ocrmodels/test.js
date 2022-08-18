// let pageTwoText = pageTwo.split("\n");
//   let pageTwoTextList = [];
//   for (let i = 0; i < pageTwoText.length; i++) {
//     if(pageTwoText[i].includes('Product Name' || 'Nama Produk')){
//       pageTwoTextList.push(pageTwoText[i+1])
//     }
//     else if (pageTwoText[i].includes('Remarks' || 'Catat')) {
//       pageTwoTextList.push(pageTwoText[i+1])
//     }
//     else if (pageTwoText[i].includes('POLICY NO.' || 'NO. POLISI')) {
//       pageTwoTextList.push(pageTwoText[i+1])
//     }
//     else if (pageTwoText[i].includes('Product Code'||'Kod Produk')) {
//       if (!isNaN(pageTwoText[i].substr(-4))) {
//         pageTwoTextList.push(pageTwoText[i].substr(-4))
//       }else{pageTwoTextList.push(pageTwoText[i+1])} 
//     }
//     else if (pageTwoText[i].includes('BANK IN SLIP NO.'||'NO. SLIP BANK DEPOSIT' || 'BANK IN SUP NO.')) {
//       pageTwoTextList.push(pageTwoText[i+1])
//     }
//     else if (pageTwoText[i] === 'Nama penuh (seperti dalam kad pengenalan)') {
//       pageTwoTextList.push(pageTwoText[i+1])
//     }
// }