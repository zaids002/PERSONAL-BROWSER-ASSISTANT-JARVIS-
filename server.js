const http = require('http');
const fs = require('fs');
const path = require('path');

const HOST = '0.0.0.0';
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'data');
const MEMORY_FILE = path.join(DATA_DIR, 'memory.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

function readMemory() {
  try {
    if (!fs.existsSync(MEMORY_FILE)) return [];
    const raw = fs.readFileSync(MEMORY_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function writeMemory(data) {
  fs.writeFileSync(MEMORY_FILE, JSON.stringify(data, null, 2));
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(payload));
}

function serveFile(res, filePath) {
  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found');
      return;
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        resolve({});
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  if (reqUrl.pathname === '/api/memory') {
    if (req.method === 'OPTIONS') {
      sendJson(res, 200, { ok: true });
      return;
    }

    if (req.method === 'GET') {
      sendJson(res, 200, { memory: readMemory() });
      return;
    }

    if (req.method === 'POST') {
      const body = await parseBody(req);
      const text = typeof body.text === 'string' ? body.text.trim() : '';
      const sender = body.sender === 'bot' ? 'bot' : 'user';

      if (!text) {
        sendJson(res, 400, { error: 'Missing text' });
        return;
      }

      const memory = readMemory();
      memory.push({
        sender,
        text,
        time: new Date().toISOString()
      });

      writeMemory(memory.slice(-100));
      sendJson(res, 200, { ok: true, memory });
      return;
    }
  }

  if (reqUrl.pathname === '/api/health') {
    sendJson(res, 200, { ok: true });
    return;
  }

  // Simple audio upload endpoint for external STT integration
  if (reqUrl.pathname === '/api/stt' && req.method === 'POST') {
    // Accept raw binary or multipart form data and write a file to data/stt_<timestamp>.wav
    const filename = `stt_${Date.now()}.wav`;
    const outPath = path.join(DATA_DIR, filename);

    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      try {
        const buffer = Buffer.concat(chunks);
        fs.writeFileSync(outPath, buffer);
        // Placeholder: integrate with an external STT provider here (Deepgram/Whisper/Google)
        // For now return a simple acknowledgment and the saved filename.
        sendJson(res, 200, { ok: true, file: filename, transcript: null, note: 'Saved audio; configure STT provider to return transcripts.' });
      } catch (err) {
        sendJson(res, 500, { error: 'Failed to save audio' });
      }
    });

    return;
  }

  const requestedPath = reqUrl.pathname === '/' ? 'index.html' : reqUrl.pathname.replace(/^\//, '');
  const safePath = path.normalize(requestedPath);
  const fullPath = path.join(ROOT, safePath);

  if (!fullPath.startsWith(ROOT)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
    serveFile(res, fullPath);
  } else {
    serveFile(res, path.join(ROOT, 'index.html'));
  }
});

server.listen(PORT, HOST, () => {
  console.log(`JARVIS backend running at http://${HOST}:${PORT}`);
});
