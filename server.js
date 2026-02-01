const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PORT = 8000;
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, filePath);
  
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'text/plain';
  
  // Set caching headers
  if (ext === '.html') {
    res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
  } else if (['.css', '.js', '.json', '.png', '.jpg', '.gif', '.svg'].includes(ext)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 - File Not Found</h1>');
      return;
    }
    
    // Gzip compression for text-based assets
    const acceptEncoding = req.headers['accept-encoding'] || '';
    const shouldCompress = /\b(gzip|deflate)\b/.test(acceptEncoding) && 
                           (contentType.includes('text') || contentType.includes('javascript') || contentType.includes('json'));
    
    if (shouldCompress) {
      const encoding = acceptEncoding.includes('gzip') ? 'gzip' : 'deflate';
      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Encoding': encoding,
        'Vary': 'Accept-Encoding'
      });
      content = encoding === 'gzip' ? zlib.gzipSync(content) : zlib.deflateSync(content);
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
    }
    
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`📁 Serving files from: ${__dirname}`);
});
