
const http = require('http');
const VERSION = '2.0';

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`<h1>Andina Market</h1><h3>Versión ${VERSION}</h3>
           <p>Desplegado automáticamente desde GitHub</p>`);
}).listen(3000);
