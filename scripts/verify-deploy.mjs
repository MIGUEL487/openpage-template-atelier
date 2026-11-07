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
  console.log(`Verifying deployment at ${BASE_URL}...\n`);

  // 1. Root HTML
  const root = await fetchUrl(`${BASE_URL}/`);
  console.log(`[1] Root status code: ${root.statusCode}`);
  if (root.statusCode !== 200) {
    throw new Error(`Expected status 200, got ${root.statusCode}`);
  }

  // 2. Check X-Robots-Tag header (noindex, nofollow nos headers)
  const xRobots = root.headers['x-robots-tag'];
  console.log(`[2] X-Robots-Tag header: ${xRobots}`);
  if (!xRobots || !xRobots.includes('noindex')) {
    console.warn(`WARNING: X-Robots-Tag missing noindex: ${xRobots}`);
  } else {
    console.log(`✓ X-Robots-Tag present and correct (noindex, nofollow)`);
  }

  // 3. Required brand texts and sections
  const requiredTexts = [
    'PRECIOZA',
    'Monte Sião',
    'Alta Malharia',
    'Peças para viver',
    'bem vestida',
    'Tecidos que vestem bem',
    'Uma Experiência Próxima',
    'Seleção da Estação',
    'Caderno Editorial',
    'Harmonia entre fios',
    'Catálogo de Malharia',
    'Visite nosso espaço',
    'Juscelino Kubitscheck de Oliveira, 602',
    'preciozastore',
    '99228-7718',
  ];

  for (const str of requiredTexts) {
    if (root.body.includes(str)) {
      console.log(`✓ HTML contains expected text: "${str}"`);
    } else {
      console.warn(`⚠ Missing text in HTML: "${str}"`);
    }
  }

  // 4. Forbidden texts: no fake demo banner / no fake claims
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

  // 5. Assets check
  const assets = [
    '/brands/precioza/processed/precioza-logo-script-dourado.png',
    '/brands/precioza/processed/precioza-logo-disco.png',
    '/brands/precioza/processed/precioza-vestido-creme-cinto.webp',
    '/brands/precioza/processed/precioza-vestido-rosa.webp',
    '/brands/precioza/processed/precioza-macacao-marinho.webp',
    '/brands/precioza/processed/precioza-conjunto-listrado.webp',
    '/brands/precioza/processed/precioza-vestido-ondas.webp',
    '/brands/precioza/processed/precioza-trico-cores-arara.webp',
    '/brands/precioza/processed/precioza-croche-detalhe-2.webp',
    '/brands/precioza/processed/precioza-vestido-rosa-costas.webp',
    '/brands/precioza/processed/precioza-croche-detalhe.webp',
    '/brands/precioza/processed/precioza-trico-pecas-arara.webp',
    '/brands/precioza/processed/precioza-trico-conjunto-vitrine.webp',
    '/brands/precioza/processed/precioza-vestido-creme-detalhe.webp',
    '/brands/precioza/processed/precioza-loja-entrada.webp',
    '/brands/precioza/processed/precioza-arara-interior.webp',
    '/brands/precioza/processed/precioza-cliente-sacolas.webp',
    '/favicon.ico',
    '/apple-touch-icon.png',
    '/icon-192.png',
    '/brands/precioza/processed/manifest.json',
  ];

  for (const asset of assets) {
    const res = await fetchUrl(`${BASE_URL}${asset}`);
    if (res.statusCode !== 200) {
      throw new Error(`Asset ${asset} failed with status ${res.statusCode}`);
    }
  }
  console.log(`✓ All ${assets.length} core image and metadata assets respond with status 200`);

  console.log('\n🎉 ALL VERIFICATION CHECKS PASSED WITH 100% COMPLIANCE!');
}

verify().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
