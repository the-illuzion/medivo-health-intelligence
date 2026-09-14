const http = require('node:http');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const root = process.env.DESIGN_EXPORT_DIR || path.join(os.tmpdir(), 'medivo-native-checks', 'all');
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
    if (!base.startsWith(path.resolve(root))) {
      res.writeHead(403);
      res.end();
      return;
    }
    const file = [base, base + '.html', path.join(base, 'index.html'), path.join(base, '(tabs).html')].find(
      (p) => fs.existsSync(p) && fs.statSync(p).isFile(),
    );
    if (!file) {
      // SPA Fallback: If not found, serve root index.html so client-side routing handles it
      const fallback = path.join(root, 'index.html');
      if (fs.existsSync(fallback)) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.createReadStream(fallback).pipe(res);
        return;
      }
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  })
  .listen(5174, '127.0.0.1', () => console.log('Native web export: http://127.0.0.1:5174'));
