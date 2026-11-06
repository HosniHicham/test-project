const http = require('http');

const server = http.createServer((req, res) => {
  // تفعيل السماح بالـ CORS للاتصال من أي صفحة خارجية
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // استقبال طلبات الـ POST من صفحة HTML
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
          message: 'تم استلام القيمة من الـ HTML بنجاح تام! 🚀',
          receivedValue: data.myValue,
          serverTime: new Date().toLocaleTimeString()
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON format' }));
      }
    });
    return;
  }

  // الصفحة الترحيبية عند فتح رابط السيرفر مباشرة
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <div style="font-family: Tahoma; text-align: center; margin-top: 50px;">
      <h2 style="color: #2e7d32;">سيرفر Node.js يعمل بنجاح تامة على السحابة! 🚀</h2>
      <p>جاهز لاستقبال بيانات التطبيق واتصالات اللعبة.</p>
    </div>
  `);
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
