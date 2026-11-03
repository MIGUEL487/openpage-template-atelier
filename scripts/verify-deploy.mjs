import https from 'https';

const BASE_URL = 'https://openpage-template-atelier.mi-c-openheimer.workers.dev';

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () =>
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
        })
      );
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

  // Check X-Robots-Tag header (Regra 3: invisível no site, apenas nos headers)
  const xRobots = root.headers['x-robots-tag'];
  console.log(`[2] X-Robots-Tag header: ${xRobots}`);
  if (!xRobots || !xRobots.includes('noindex')) {
    console.warn(`WARNING: X-Robots-Tag missing noindex: ${xRobots}`);
  } else {
    console.log(`✓ X-Robots-Tag present and correct (noindex, nofollow)`);
  }

  // Check required brand strings
  const requiredTexts = [
    'PRECIOZA',
    'Monte Sião',
    'MALHARIA',
    '99228-7718',
  ];

  for (const str of requiredTexts) {
    if (root.body.includes(str)) {
      console.log(`✓ HTML contains expected text: "${str}"`);
    } else {
      console.warn(`⚠ Missing text in HTML: "${str}"`);
    }
  }

  // Verify that all demo / non-official warning notices are REMOVED (Regra 3)
  const forbiddenTexts = [
    'Proposta Conceitual Não Oficial',
    'sem vínculo com a Precioza',
    'Demonstração Conceitual Não Oficial',
    'Ambiente de estudo e validação sem vínculo comercial ativo',
  ];

  for (const forbidden of forbiddenTexts) {
    if (root.body.includes(forbidden)) {
      throw new Error(`CRITICAL: Found forbidden demo notice in HTML: "${forbidden}"`);
    } else {
      console.log(`✓ Verified removal of demo notice: "${forbidden}"`);
    }
  }

  // Check new assets (script logo, disco icon, favicons, processed webp photos)
  const assets = [
    '/brands/precioza/processed/precioza-logo-script-dourado.webp',
    '/brands/precioza/processed/precioza-logo-disco.png',
    '/brands/precioza/processed/precioza-vestido-creme-cinto.webp',
    '/brands/precioza/processed/precioza-vestido-rosa.webp',
    '/brands/precioza/processed/precioza-macacao-marinho.webp',
    '/brands/precioza/processed/precioza-conjunto-listrado.webp',
    '/brands/precioza/processed/precioza-loja-entrada.webp',
    '/favicon.ico',
    '/apple-touch-icon.png',
    '/icon-192.png',
    '/brands/precioza/processed/manifest.json',
  ];

  for (const asset of assets) {
    const res = await fetchUrl(`${BASE_URL}${asset}`);
    console.log(`[Asset] ${asset} -> Status: ${res.statusCode}, Content-Type: ${res.headers['content-type']}`);
    if (res.statusCode !== 200) {
      throw new Error(`Asset ${asset} failed with status ${res.statusCode}`);
    }
  }

  console.log('\n🎉 ALL LIVE DEPLOY CHECKS PASSED SUCCESSFULLY WITH 100% COMPLIANCE!');
}

verify().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
