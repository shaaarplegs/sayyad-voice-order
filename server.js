const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

try {
  process.loadEnvFile(path.join(__dirname, '.env'));
} catch {
  // No .env yet; keys may come from the environment.
}

const { runPipeline } = require('./pipeline');

const PORT = process.env.PORT || 3000;
const MAX_AUDIO_BYTES = 25 * 1024 * 1024; // Whisper API limit
const PUBLIC_DIR = path.join(__dirname, 'public');
const EXTENSIONS = { webm: 'webm', ogg: 'ogg', mp4: 'mp4', mpeg: 'mp3', mp3: 'mp3', wav: 'wav', 'x-wav': 'wav', m4a: 'm4a', 'x-m4a': 'm4a' };

function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_AUDIO_BYTES) {
        reject(new Error('Audio is larger than 25 MB.'));
        req.destroy();
      } else chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/api/voice-order') {
    try {
      const mimeType = (req.headers['content-type'] || 'audio/webm').split(';')[0];
      const ext = EXTENSIONS[mimeType.split('/')[1]] || 'webm';
      const audio = await readBody(req);
      if (!audio.length) return sendJson(res, 400, { error: 'No audio received.' });
      const result = await runPipeline(audio, `recording.${ext}`, mimeType);
      console.log(`[voice-order] intent=${result.intent} transcript="${result.transcript}"`);
      return sendJson(res, 200, result);
    } catch (err) {
      console.error(err);
      return sendJson(res, 500, { error: err.message });
    }
  }

  if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return fs.createReadStream(path.join(PUBLIC_DIR, 'index.html')).pipe(res);
  }

  sendJson(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => console.log(`Sayyad voice-to-order running at http://localhost:${PORT}`));
