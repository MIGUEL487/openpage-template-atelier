import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const target = 'https://openpage-template-atelier.mi-c-openheimer.workers.dev/';
const refDir = path.resolve('reference');
if (!fs.existsSync(refDir)) {
  fs.mkdirSync(refDir, { recursive: true });
}

const desktopShot = path.join(refDir, 'live-redesign-desktop-1440.png');
const mobileShot = path.join(refDir, 'live-redesign-mobile-390.png');
const tmpProfile = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-live-audit-'));

console.log('Capturing live URL screenshots...');
try {
  console.log('1. Capturing Desktop 1440x900...');
  execFileSync(chromePath, [
    '--headless=new',
    `--user-data-dir=${tmpProfile}`,
    `--screenshot=${desktopShot}`,
    '--window-size=1440,900',
    '--disable-gpu',
    target,
  ], { timeout: 25000 });
  console.log('Saved desktop screenshot:', desktopShot, 'size:', fs.statSync(desktopShot).size);

  console.log('2. Capturing Mobile 390x844...');
  execFileSync(chromePath, [
    '--headless=new',
    `--user-data-dir=${tmpProfile}`,
    `--screenshot=${mobileShot}`,
    '--window-size=390,844',
    '--disable-gpu',
    target,
  ], { timeout: 25000 });
  console.log('Saved mobile screenshot:', mobileShot, 'size:', fs.statSync(mobileShot).size);
} finally {
  try {
    fs.rmSync(tmpProfile, { recursive: true, force: true });
  } catch {}
}
