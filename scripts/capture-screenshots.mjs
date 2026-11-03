import { execFileSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const baseDir = path.resolve('.');
const outDir = path.join(baseDir, 'out');
const targetHtml = `file:///${outDir.replace(/\\/g, '/')}/index.html`;

const destDir = path.join(baseDir, 'public', 'brands', 'precioza');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const desktopShot = path.join(destDir, 'screenshot-desktop.png');
const mobileShot = path.join(destDir, 'screenshot-mobile.png');

console.log('Capturing Desktop screenshot...');
execFileSync(chromePath, [
  '--headless=new',
  `--screenshot=${desktopShot}`,
  '--window-size=1280,900',
  '--disable-gpu',
  targetHtml,
]);
console.log('Saved:', desktopShot);

console.log('Capturing Mobile screenshot (390x844)...');
execFileSync(chromePath, [
  '--headless=new',
  `--screenshot=${mobileShot}`,
  '--window-size=390,844',
  '--disable-gpu',
  targetHtml,
]);
console.log('Saved:', mobileShot);

// Check files
console.log('Desktop screenshot size:', fs.statSync(desktopShot).size, 'bytes');
console.log('Mobile screenshot size:', fs.statSync(mobileShot).size, 'bytes');
console.log('Done!');
