const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.json());

// السماح بالاتصال الخارجي (CORS) من أي تطبيق أو واجهة
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// 🔗 رابط الاتصال بـ MongoDB مع وضع كلمة المرور الخاصة بك مكان <db_password>
const uri = "mongodb+srv://hosnisimHicham_db_user:<db_password>@testdb.oxke66p.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

let db;

async function startServer() {
  try {
    await client.connect();
    db = client.db("TestDB"); // اسم قاعدة البيانات
    console.log("✅ متصل بنجاح مع MongoDB Atlas!");
  } catch (e) {
    console.error("❌ خطأ في الاتصال:", e);
  }
}
startServer();

// 🚀 مسار ديناميكي لاستقبال أي بيانات أو كلمات وتخزينها فوراً
app.post('/api/send', async (req, res) => {
  try {
    const dataToSend = req.body; // يستقبل أي كائن JSON بدون تقييد بالأعمدة
    dataToSend.timestamp = new Date();

    if (!db) {
      return res.status(500).json({ success: false, message: "قاعدة البيانات لم تتصل بعد" });
    }

    const collection = db.collection('messages');
    const result = await collection.insertOne(dataToSend);

    res.json({
      success: true,
      message: "تم حفظ البيانات في MongoDB بنجاح! 🚀",
      insertedId: result.insertedId,
      receivedData: dataToSend
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
