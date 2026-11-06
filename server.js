const http = require('http');

const server = http.createServer((req, res) => {
  // السماح بالوصول من أي مصدر (CORS) لكي نستطيع إرسال بيانات من أي صفحة HTML
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // إذا قام المستخدم بإرسال بيانات (POST)
  if (req.method === 'POST' && req.url === '/api/test') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          status: 'success',
          message: 'تم استلام القيمة من الـ HTML بنجاح! 🚀',
          receivedValue: data.myValue,
          serverTime: new Date().toLocaleTimeString()
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  // الصفحة الافتراضية عند فتح الرابط في المتصفح
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <div style="font-family: Tahoma; text-align: center; margin-top: 50px;">
      <h2 style="color: #2e7d32;">سيرفر Node.js يعمل بنجاح تامة! 🚀</h2>
      <p>جاهز لاستقبال طلبات ألعاب اللودو و WebSocket قريباً.</p>
    </div>
  `);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
