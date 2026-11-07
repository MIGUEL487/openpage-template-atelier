import { execFileSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import http from 'http';
import os from 'os';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const baseDir = path.resolve('.');
const outDir = path.join(baseDir, 'out');
const PORT = 3457;

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain',
};

function serveStatic(port) {
  const server = http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    if (reqPath.endsWith('/')) reqPath += 'index.html';
    else if (!path.extname(reqPath)) reqPath += '/index.html';

    const filePath = path.join(outDir, reqPath);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  });

  return new Promise((resolve) => {
    server.listen(port, () => resolve(server));
  });
}

async function main() {
  console.log(`Starting local server on http://127.0.0.1:${PORT}...`);
  const server = await serveStatic(PORT);

  const refDir = path.join(baseDir, 'reference');
  if (!fs.existsSync(refDir)) {
    fs.mkdirSync(refDir, { recursive: true });
  }

  const desktopShot = path.join(refDir, 'redesign-desktop.png');
  const mobileShot = path.join(refDir, 'redesign-mobile.png');
  const tmpProfile = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-audit-'));

  try {
    console.log('Capturing Desktop screenshot (1440x900)...');
    execFileSync(chromePath, [
      '--headless=new',
      `--user-data-dir=${tmpProfile}`,
      `--screenshot=${desktopShot}`,
      '--window-size=1440,900',
      '--hide-scrollbars',
      '--disable-gpu',
      `http://127.0.0.1:${PORT}/`,
    ], { timeout: 20000 });
    console.log('Saved:', desktopShot, 'size:', fs.statSync(desktopShot).size);

    console.log('Capturing Mobile screenshot (390x844)...');
    execFileSync(chromePath, [
      '--headless=new',
      `--user-data-dir=${tmpProfile}`,
      `--screenshot=${mobileShot}`,
      '--window-size=390,844',
      '--hide-scrollbars',
      '--disable-gpu',
      `http://127.0.0.1:${PORT}/`,
    ], { timeout: 20000 });
    console.log('Saved:', mobileShot, 'size:', fs.statSync(mobileShot).size);
  } finally {
    server.close();
    try {
      fs.rmSync(tmpProfile, { recursive: true, force: true });
    } catch {}
  }
}

main().catch(console.error);
