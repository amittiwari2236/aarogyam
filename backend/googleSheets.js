const { google } = require('googleapis');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// Function to authenticate and get Google Sheets client
async function getAuthClient() {
    try {
        let credentialsPath = process.env.GOOGLE_CREDENTIALS_PATH;
        // Automatically resolve path if it starts with ./ or ../
        if (credentialsPath && (credentialsPath.startsWith('./') || credentialsPath.startsWith('../'))) {
             credentialsPath = path.resolve(__dirname, '..', credentialsPath);
        } else if (!credentialsPath) {
             credentialsPath = path.resolve(__dirname, '../credentials.json');
        }

        const auth = new google.auth.GoogleAuth({
            keyFile: credentialsPath,
            scopes: SCOPES,
        });
        const client = await auth.getClient();
        return google.sheets({ version: 'v4', auth: client });
    } catch (error) {
        console.error('Error authenticating with Google Sheets.', error.message);
        console.error('Ensure that credentials.json exists and GOOGLE_CREDENTIALS_PATH is correct in .env');
        throw error;
    }
}

// Function to append a row to the spreadsheet
async function appendToSheet(values) {
    try {
        const sheets = await getAuthClient();
        const spreadsheetId = process.env.GOOGLE_SHEET_ID;

        // Assuming data goes into "Sheet1" and columns are A to H to fit age and yogaType at the end
        const range = 'Sheet1!A:H'; 

        const request = {
            spreadsheetId,
            range,
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            resource: {
                values: [values],
            },
        };

        const response = await sheets.spreadsheets.values.append(request);
        return response.data;
    } catch (error) {
        console.error('Error appending data to sheet:', error);
        throw error;
    }
}

module.exports = {
    appendToSheet
};
