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

// 🔗 رابط الاتصال القياسي بـ MongoDB مع كلمة المرور المحدثة
const uri = "mongodb://hosnisimhicham_db_user:Hosni12345@ac-5g0l1zq-shard-00-00.oxke66p.mongodb.net:27017,ac-5g0l1zq-shard-00-01.oxke66p.mongodb.net:27017,ac-5g0l1zq-shard-00-02.oxke66p.mongodb.net:27017/?ssl=true&replicaSet=atlas-rhjhxk-shard-0&authSource=admin";
const client = new MongoClient(uri);

let db;

async function startServer() {
  try {
    await client.connect();
    db = client.db("TestDB"); // اسم قاعدة البيانات
    console.log("✅ متصل بنجاح مع MongoDB Atlas!");
  } catch (e) {
    console.error("❌ خطأ في الاتصال بقاعدة البيانات:", e.message);
  }
}
startServer();

// مسار ترحيبي لفتح الرابط في المتصفح والتأكد أن السيرفر حي
app.get('/', (req, res) => {
  res.send('🚀 محرك Node.js وقاعدة بيانات MongoDB يعملان بنجاح تام!');
});

// 🚀 مسار استقبال البيانات وتخزينها فوراً
app.post('/api/send', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ success: false, error: "قاعدة البيانات غير متصلة حالياً." });
    }

    const dataToSend = req.body;
    dataToSend.timestamp = new Date();

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
