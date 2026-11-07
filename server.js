const express = require('express');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

const app = express();
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
});

app.get('/', (req, res) => {
    res.send('Server is running and connected to Google Sheets successfully!ZZ');
});

app.post('/log', async (req, res) => {
    try {
        const { name, status } = req.body; 

        // إصلاح نهائي لقراءة المفتاح وتجنب مشاكل الـ Decoder
        const privateKey = process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY.replace(/\\n/g, '\n') : undefined;

        const serviceAccountAuth = new JWT({
            email: "bot-hosni-531@mesheetserver-514010.iam.gserviceaccount.com",
            key: privateKey,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const doc = new GoogleSpreadsheet('1vHEtlx2hWhyiK6xk3qgqFtvGipoxyvwZjUCUZISDA0c', serviceAccountAuth);
        await doc.loadInfo();
        
        const sheet = doc.sheetsByIndex[0];
        
        await sheet.addRow({ 
            "الاسم": name || "زيارة من السيرفر السحابي", 
            "الحالة": status || "ناجح تماماً" 
        });

        res.status(200).json({ success: true, message: "تمت الكتابة في الشيت من السيرفر السحابي بنجاح!" });
    } catch (error) {
        console.error("خطأ أثناء الكتابة:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Cloud Server is running on port ${PORT}`);
});
