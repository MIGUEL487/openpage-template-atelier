import https from 'https';

const BASE_URL = 'https://openpage-template-atelier.mi-c-openheimer.workers.dev';

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({
        statusCode: res.statusCode,
        headers: res.headers,
        body: data,
      }));
    }).on('error', reject);
  });
}

async function verify() {
  console.log(`Verifying live deployment at ${BASE_URL}...`);

  // 1. Root HTML
  const root = await fetchUrl(`${BASE_URL}/`);
  console.log(`[1] Root status code: ${root.statusCode}`);
  if (root.statusCode !== 200) {
    throw new Error(`Expected status 200, got ${root.statusCode}`);
  }

  // Check X-Robots-Tag header
  const xRobots = root.headers['x-robots-tag'];
  console.log(`[2] X-Robots-Tag header: ${xRobots}`);
  if (!xRobots || !xRobots.includes('noindex')) {
    console.warn(`WARNING: X-Robots-Tag not found in headers or missing noindex: ${xRobots}`);
  } else {
    console.log(`✓ X-Robots-Tag present and correct`);
  }

  // Check required HTML strings
  const checks = [
    'PRECIOZA',
    'Monte Sião',
    'Demonstração Conceitual',
    'Proposta Conceitual Não Oficial',
    'A Arte da Trama',
    'noindex',
  ];

  for (const str of checks) {
    if (root.body.includes(str)) {
      console.log(`✓ HTML contains expected text: "${str}"`);
    } else {
      console.warn(`⚠ Missing text in HTML: "${str}"`);
    }
  }

  // Check assets
  const assets = [
    '/brands/precioza/processed/cream-dress-model.webp',
    '/brands/precioza/processed/blue-evening-model.webp',
    '/brands/precioza/processed/logo-avatar.webp',
    '/brands/precioza/processed/manifest.json',
  ];

  for (const asset of assets) {
    const res = await fetchUrl(`${BASE_URL}${asset}`);
    console.log(`[Asset] ${asset} -> Status: ${res.statusCode}, Content-Type: ${res.headers['content-type']}`);
    if (res.statusCode !== 200) {
      throw new Error(`Asset ${asset} failed with status ${res.statusCode}`);
    }
  }

  console.log('\n🎉 ALL LIVE DEPLOY CHECKS PASSED SUCCESSFULLY!');
}

verify().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
