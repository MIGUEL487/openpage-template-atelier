import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateIconsAndLogos() {
  const processedDir = 'public/brands/precioza/processed';
  const publicDir = 'public';

  const scriptLogoPath = path.join(processedDir, 'precioza-logo-script-dourado.png');
  const discoLogoPath = path.join(processedDir, 'precioza-logo-disco.png');

  const scriptMeta = await sharp(scriptLogoPath).metadata();
  console.log('Script logo:', scriptMeta.width, 'x', scriptMeta.height);

  const discoMeta = await sharp(discoLogoPath).metadata();
  console.log('Disco logo:', discoMeta.width, 'x', discoMeta.height);

  // 1. Generate WebP 1x and 2x for script logo
  // 678 x 239 is native
  await sharp(scriptLogoPath)
    .webp({ quality: 95 })
    .toFile(path.join(processedDir, 'precioza-logo-script-dourado.webp'));
  console.log('Generated precioza-logo-script-dourado.webp');

  // Also half size (1x) if native is ~2x (339x120)
  await sharp(scriptLogoPath)
    .resize(Math.round(scriptMeta.width / 2), Math.round(scriptMeta.height / 2))
    .webp({ quality: 95 })
    .toFile(path.join(processedDir, 'precioza-logo-script-dourado-1x.webp'));
  console.log('Generated precioza-logo-script-dourado-1x.webp');

  // 2. Generate Favicon & App Icons from disco logo
  // icon-192.png
  await sharp(discoLogoPath)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'icon-192.png'));
  console.log('Generated public/icon-192.png');

  // icon-512.png
  await sharp(discoLogoPath)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon-512.png'));
  console.log('Generated public/icon-512.png');

  // apple-touch-icon.png (180x180)
  await sharp(discoLogoPath)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Generated public/apple-touch-icon.png');

  // favicon-32x32.png, favicon-16x16.png
  await sharp(discoLogoPath)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'));
  await sharp(discoLogoPath)
    .resize(16, 16)
    .png()
    .toFile(path.join(publicDir, 'favicon-16x16.png'));

  // favicon.ico (can be a 32x32 png saved as favicon.ico or multi-size)
  // modern browsers accept PNG-in-ICO or standard 32x32 PNG for favicon.ico
  await sharp(discoLogoPath)
    .resize(48, 48)
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'));
  console.log('Generated public/favicon.ico');
}

generateIconsAndLogos().catch(console.error);
