const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = process.env.DESIGN_EXPORT_DIR || '/tmp/medivo-native-checks/all';
const types = {
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.html': 'text/html',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
};
http
  .createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const relative = decodeURIComponent(url.pathname).replace(/^\/+/, '');
    const base = path.resolve(root, relative || 'index');
    if (!base.startsWith(path.resolve(root) + path.sep)) {
      res.writeHead(403);
      res.end();
      return;
    }
    const file = [base, base + '.html', path.join(base, 'index.html')].find(
      (p) => fs.existsSync(p) && fs.statSync(p).isFile(),
    );
    if (!file) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  })
  .listen(5174, '127.0.0.1', () => console.log('Native web export: http://127.0.0.1:5174'));
