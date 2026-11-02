import https from 'node:https';

const url = 'https://openpage-template-atelier.mi-c-openheimer.workers.dev';

function checkUrl(targetUrl) {
  return new Promise((resolve, reject) => {
    https.get(targetUrl, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          bodyLength: data.length,
          hasAtelier: data.includes('ATELIER'),
          hasFabric: data.includes('The Fabric') || data.includes('tecido-3d'),
          hasWhatsapp: data.includes('wa.me'),
          hasImages: data.includes('/images/hero-knit.jpg'),
        });
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log(`Verificando endpoint público: ${url}`);
  try {
    const rootResult = await checkUrl(url);
    console.log('--- Teste da Página Inicial ---');
    console.log('Status HTTP:', rootResult.status);
    console.log('Tamanho HTML:', rootResult.bodyLength, 'bytes');
    console.log('Contém ATELIER:', rootResult.hasAtelier);
    console.log('Contém Seção 3D The Fabric:', rootResult.hasFabric);
    console.log('Contém Integração WhatsApp:', rootResult.hasWhatsapp);
    console.log('Contém Imagens Editoriais:', rootResult.hasImages);

    // Teste de asset estático de imagem
    const imgResult = await checkUrl(`${url}/images/hero-knit.jpg`);
    console.log('--- Teste de Recurso Estático (Imagem) ---');
    console.log('Status HTTP da imagem:', imgResult.status);
    console.log('Content-Type:', imgResult.headers['content-type']);
    console.log('Tamanho:', imgResult.bodyLength, 'bytes');
  } catch (err) {
    console.error('Erro na verificação:', err);
  }
}

main();
