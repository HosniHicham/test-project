const express = require('express');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

const app = express();
app.use(express.json());

// تفعيل CORS لكي يستقبل الطلبات من أي تطبيق خارجي (مثل Kodular أو تطبيقات الويب)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
});

// مسار تجريبي للتأكد أن السيرفر يعمل
app.get('/', (req, res) => {
    res.send('Server is running and connected to Google Sheets successfully!');
});

// مسار استقبال البيانات والكتابة في الشيت مباشرة
app.post('/log', async (req, res) => {
    try {
        // استقبال البيانات المرسلة في طلب الـ POST
        const { name, status } = req.body; 

        // إعداد المصادقة باستخدام بيانات حساب الخدمة الخاص بك
        const serviceAccountAuth = new JWT({
            email: "bot-hosni-531@mesheetserver-514010.iam.gserviceaccount.com",
            key: `-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDuKuJsaUEC9Ghy\nXczZHFgvouHuSHCiWTP3pMagwSPaG+mOjWjeoeywwv5jpS89Zv9nU7nXqAFIY3Iq\na61BFgEfR7/vgS4b5uuo49xMudzzizPlk+fgFJ9r2Jwid6gMeAjuaaBVp7D6NgPj\nkLxbJhd4gJ5X8gZiPHIGut/0mFmdudJCijDvkkTvujMmQbd+89SlG7L5v0xN7rOz\n2a6BYZ7vSmJYfI5gdw+UFTEfyVU4YYRZ32PQqLqgQ164LGGr0VUXTXilyTj6JqeX\n/00FGx8DWUE9uMfJvkW9cTDUK0/abLHRDjNcYxR9q67ef7Es8AS+kUe5V16idP/S\njaXUfD6TAgMBAAECggEAcOHWi3efnpzk3D/lFYo/qeRTnTKsX+ZToS5yDkM8kOXl\n3vDbIZoxqt3g4K2sJDgrGXgvfy1b3kl0FPMQHOcnBQJm0Eez6Pmb/GJzSdJWDQCP\nSmK95hEgNmdmKVf5SF+kLAvYOIDQeucbFMLG45S8Txr28cv+hpULnnD4MN/8qao8\n82ub5BASraFbZQKnt6oWTB8sm4eFJZJmVlZ3OVRP+9+MUY9bOuMxAbpoZgmXd4B9\nBBvvAy0Ss4X0cada6GgjXHs4kpZgS95LOcuGVQxqQEapWInPug5OgXZGN0wraYf7\nOt1lfHVh8dcqMggPnhrQx2Zee83OVrALWTXy8+1+0QKBgQD/BUqX+3CmOVvScfb1\ndJH6Ef1yJrgVG0xPusKMKz1GLCQ6SxutPIAetxQRlwo1uJ7NfdsgdFy0ILogACqY\n2mmUqIPHKJt3TF65rs1hMSAw/abMDdObdHrq5/9yw92X0c+rtB0VC+7rDIHIbwWy\nnJnEUL7Ax92jTKh6ktedzSOK5wKBgQDvFQZfpPaG4VLQihx3nc8roxx3jyILbQ3t\na4a+x6Ybm7VtMKN7PVQnbnTmXexj0BEjDMyKcXolctrrWaR8MJIIbRXWO0Vvghy5\n5+L7d0GZT0EB3Go5G81yNXPJ/AroIkyUa/T9M2c8WslwvF5OOb9O3dDlcJdeCVBa\nQBzJOpbFdQKBgQD28kLHZV4yOHzoDh+clGL/Cwinz0KWfbapxim53e0Z1IjIQg7s\n9BcEpzgxyFbEqqBsUKEujj9u1fomHsMg/O8cWwowguv42+UmXVTX9uA7UISCOCle\n8a5NZpaApZYg+7TjiihXRxT2W0gZtRiJWweziJUOzPuctBC5kRRl5E20pQKBgBE4\n8YGYT43900pkeJKBUrgxAs72B5zNGVC+CzHZDfU1LUeVVmF9VH+WrGMf5vR1u5ZL\nyLw8WnEyKeUESx4LHanvub/5+xGCTPFza91zhM03cVZh+2DryMvuX83wExUPy3Zx\npG9M8aXeYF53o099R3O19ONiTfUfNKObtLcmOlA1AoGAQpXx8iIwawRoxeO5aDra\nVBVJDK6s3wyXgvqKIVEwNS2XOVp/hrg0VYgH5TdzHTEEniXCY7wsc90aMed8pqIH\nxzvpBJuLEGM59qyakjZL8Nr+qNpr1P3DpcmZZJiJOaOWQWlX/zQZdvqTVWs3VKNl\n7ZbcUAfEkFv7IQZrfBQG9tc=\n-----END PRIVATE KEY----^\n`,
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
