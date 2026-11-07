const express = require('express');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

const app = express();
app.use(express.json());

// تفعيل CORS لكي يستقبل الطلبات من أي تطبيق خارجي
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
});

// مسار تجريبي للتأكد أن السيرفر يعمل
app.get('/', (req, res) => {
    res.send('Server is running and connected to Google Sheets successfully!3');
});

// مسار استقبال البيانات والكتابة في الشيت مباشرة
app.post('/log', async (req, res) => {
    try {
        const { name, status } = req.body; 

        // إعداد المصادقة بقراءة المفتاح بأمان من إعدادات الاستضافة
        const serviceAccountAuth = new JWT({
            email: "bot-hosni-531@mesheetserver-514010.iam.gserviceaccount.com",
            key: process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        // ربط الشيت المستهدف باستخدام الـ ID
        const doc = new GoogleSpreadsheet('1vHEtlx2hWhyiK6xk3qgqFtvGipoxyvwZjUCUZISDA0c', serviceAccountAuth);
        await doc.loadInfo();
        
        const sheet = doc.sheetsByIndex[0];
        
        // إضافة الصف الجديد بالبيانات المستقبلة
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
