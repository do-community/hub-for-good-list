/*
Copyright 2022 DigitalOcean

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
    const doc = new GoogleSpreadsheet(sheetId);
    await doc.useServiceAccountAuth({
        client_email: clientEmail,
        private_key: privateKey,
    });
    await doc.loadInfo();

    // Get the approval sheet
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    // Get the rows that are public & approved
    const approved = rows.filter(row =>
        row.is_public && row.status
        && (row.is_public.toLowerCase().trim() === '["yes"]' || row.is_public.toLowerCase().trim() === 'yes')
        && row.status.toLowerCase().trim() === 'approved');

    // Only keep the columns we need
    const sanitised = approved.map(row => ({
        id: row.rowNumber,
        name: row.project_name || '',
        link: row.project_link || '',
        purpose: row.project_purpose || '',
    }));

    // Export the data
    await fs.promises.writeFile(path.join(__dirname, 'data.json'), JSON.stringify(sanitised));
};

main().catch(err => {
    console.error(err);
    process.exit(1);
});


