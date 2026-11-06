const http = require('http');

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // مسار استقبال البيانات الجديد
  if (req.method === 'POST' && req.url === '/api/test') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          status: 'success', 
          message: 'تم استقبال البيانات بنجاح من الـ HTML! شكرا لكم', 
          receivedValue: data.myValue 
        }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  // الصفحة العادية عند فتح الرابط المباشر
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end('<h2>السيرفر جاهز ويستقبل البيانات بنجاح! 🚀</h2>');
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
