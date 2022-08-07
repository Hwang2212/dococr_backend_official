import { google } from 'googleapis';



const KEYFILEPATH = './winter-justice-358511-80f7012c9266.json';
const SCOPES = ['https://www.googleapis.com/auth/drive'];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

// Folder ID: 
// Customer IC - 15LYwksi_xfioTCjld_UTNSrBUundCHyi
export let driveService = google.drive({ version: 'v3', auth });




