const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

const uri = "mongodb+srv://hosnisimhicham_db_user:Hosni12345@testdb.oxke66p.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  tls: true,
  tlsAllowInvalidCertificates: true,
  tlsAllowInvalidHostnames: true
});

let db;

// دالة اتصال ذكية تضمن الاتصال الفوري عند الحاجة
async function connectDB() {
  if (!db) {
    try {
      await client.connect();
      db = client.db("TestDB");
      console.log("✅ متصل بنجاح مع MongoDB Atlas!");
    } catch (e) {
      console.error("❌ خطأ في الاتصال بقاعدة البيانات:", e.message);
      throw e;
    }
  }
  return db;
}

// محاولة الاتصال الأولية عند الإقلاع
connectDB().catch(() => {});

app.get('/', (req, res) => {
  res.send('🚀 محرك Node.js وقاعدة بيانات MongoDB يعملان بنجاح تام!');
});

app.post('/api/send', async (req, res) => {
  try {
    // ضمان الاتصال بقاعدة البيانات حتى لو تأخر السيرفر في الإقلاع
    const database = await connectDB();

    const dataToSend = req.body;
    dataToSend.timestamp = new Date();

    const collection = database.collection('messages');
    const result = await collection.insertOne(dataToSend);

    res.json({
      success: true,
      message: "تم حفظ البيانات في MongoDB بنجاح! 🚀",
      insertedId: result.insertedId,
      receivedData: dataToSend
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "تعذر الاتصال بقاعدة البيانات حالياً: " + error.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
