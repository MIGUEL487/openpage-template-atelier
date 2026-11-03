import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const target = 'https://openpage-template-atelier.mi-c-openheimer.workers.dev/';
const outPath = path.resolve('live-screen.png');
const tmpProfile = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-live-'));

console.log('Capturing live URL screenshot with isolated profile...');
try {
  execFileSync(chromePath, [
    '--headless=new',
    `--user-data-dir=${tmpProfile}`,
    `--screenshot=${outPath}`,
    '--window-size=1280,900',
    '--disable-gpu',
    target,
  ], { timeout: 25000 });

  console.log('Screenshot saved, size:', fs.statSync(outPath).size, 'bytes');
} finally {
  try {
    fs.rmSync(tmpProfile, { recursive: true, force: true });
  } catch {}
}
