// /////////////////////////////////////////////////////////////////////////////////
//   // Page Five Data Processing
//   let pageFiveText = pageFive.split("\n");
//   let pageFiveTextList = [];
//   for (let i = 0; i < pageFiveText.length; i++) {
//     pageFiveText[i]=pageFiveText[i].replaceAll(' ','')
//     // pageTwoText.push(pageTwoText[i])
//   }
//   for (let i = 0; i < pageFiveText.length; i++) {
//     if(pageFiveText[i].includes('Basic' || 'Planname' || "Namapelan")){
//       pageFiveTextList.push(pageFiveText[i+1])
//       break;
//     }
//   }
//   for (let i = 0; i < pageFiveText.length; i++) {
//     if(pageFiveText[i].includes('Tempoh' || 'tahun')){
//       pageFiveTextList.push(pageFiveText[i+1])
//       break;
//     }
//   }
//   for (let i = 0; i < pageFiveText.length; i++) {
//     if(pageFiveText[i].includes('Jumlahyang' && 'diinsuranskan')){
//       pageFiveTextList.push(pageFiveText[i+1])
//       break;
//     }
//   }
//   // Skip this loop Installment Premium
//   for (let i = 0; i < pageFiveText.length; i++) {
//     if(pageFiveText[i].includes('Premiumansuran')){
//       pageFiveTextList.push(pageFiveText[i+1])
//       break;
//     }
//   }