import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const zipPath = 'C:\\Users\\Windows\\.gemini\\antigravity\\brain\\02614721-dea3-41b3-8f9b-4eec75c8e147\\.user_uploaded\\media_1793706513630_61d6130e.zip';
const targetDir = 'C:\\Users\\Windows\\.gemini\\antigravity\\scratch\\openpage-template-atelier\\public\\brands\\precioza\\processed';
const tempDir = 'C:\\Users\\Windows\\.gemini\\antigravity\\scratch\\openpage-template-atelier\\temp_zip_extract';

if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
fs.mkdirSync(tempDir, { recursive: true });

// Use tar or powershell Expand-Archive
console.log('Extracting archive...');
execSync(`tar -xf "${zipPath}" -C "${tempDir}"`, { stdio: 'inherit' });

console.log('Copying files to targetDir...');
const outDir = path.join(tempDir, 'out');
const files = fs.readdirSync(outDir);

for (const file of files) {
  const src = path.join(outDir, file);
  const dest = path.join(targetDir, file);
  fs.copyFileSync(src, dest);
  console.log('Copied:', file);
}

fs.rmSync(tempDir, { recursive: true, force: true });
console.log('Done!');
