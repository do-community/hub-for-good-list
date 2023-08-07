/*
Copyright 2023 DigitalOcean

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const fs = require('fs');
const path = require('path');
const { JWT } = require('google-auth-library');
const { GoogleSpreadsheet } = require('google-spreadsheet');

const main = async () => {
    if (process.env.STUB_PROJECT_DATA === 'true') {
        await fs.promises.writeFile(path.join(__dirname, 'data.json'), JSON.stringify([]));
        return;
    }

    // Load our config from env or file
    let clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;
    let sheetId = process.env.GOOGLE_SHEET_ID;
    if (fs.existsSync(path.join(__dirname, '..', '..', 'config.js'))) {
        ({ clientEmail, privateKey, sheetId } = require('../../config'));
    }

    // Connect to the document
    const auth = new JWT({
        email: clientEmail,
        key: privateKey,
        scopes: [ 'https://www.googleapis.com/auth/spreadsheets' ],
    });
    const doc = new GoogleSpreadsheet(sheetId, auth);
    await doc.loadInfo();

    // Get the approval sheet
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    // Get the rows that are public & approved
    const approved = rows.filter(row => {
        const is_public = row.get('is_public')?.toLowerCase()?.trim();
        const status = row.get('status')?.toLowerCase()?.trim();
        return (is_public === 'yes' || is_public === '["yes"]') && status === 'approved';
    });

    // Only keep the columns we need
    const sanitised = approved.map(row => ({
        id: row.rowNumber,
        name: row.get('project_name') || '',
        link: row.get('project_link') || '',
        purpose: row.get('project_purpose') || '',
    }));

    // Export the data
    await fs.promises.writeFile(path.join(__dirname, 'data.json'), JSON.stringify(sanitised));
};

main().catch(err => {
    console.error(err);
    process.exit(1);
});
