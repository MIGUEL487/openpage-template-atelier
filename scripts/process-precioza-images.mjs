import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const refDir = path.resolve('public/brands/precioza/reference');
const outDir = path.resolve('public/brands/precioza/processed');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Map of image configurations with specific honest descriptions and crop offsets
const imageConfigs = [
  {
    file: '01_logo_avatar.png',
    slug: 'logo-avatar',
    alt: 'Logotipo Precioza em caligrafia dourada sobre medalhão grafite escuro',
    crop: { left: 0, top: 0, bottom: 0, right: 0 },
  },
  {
    file: '02_store_entrance.png',
    slug: 'store-entrance',
    alt: 'Fachada e vitrine da loja física Precioza com letreiro dourado em Monte Sião',
    crop: { left: 0, top: 0, bottom: 0, right: 0 },
  },
  {
    file: '03_model_shopping_bags.png',
    slug: 'model-shopping-bags',
    alt: 'Cliente segurando sacolas personalizadas no interior aconchegante da boutique',
    crop: { left: 0, top: 0, bottom: 0, right: 0 },
  },
  {
    file: '04_knit_swatches.png',
    slug: 'knit-swatches',
    alt: 'Araras e texturas de peças em tricô e malharia artesanal',
    crop: { left: 0, top: 0, bottom: 0, right: 0 },
  },
  {
    file: '05_brand_bag_novidades.png',
    slug: 'brand-bag-novidades',
    alt: 'Sacola oficial da marca em papel kraft nobre com aplicação em dourado',
    crop: { left: 0, top: 0, bottom: 0, right: 0 },
  },
  {
    file: '06_cream_dress_model.png',
    slug: 'cream-dress-model',
    alt: 'Modelo com vestido longo em tom creme com cinto estruturado',
    crop: { left: 0, top: 0, bottom: 27, right: 0 },
  },
  {
    file: '07_wavy_dress_model.png',
    slug: 'wavy-dress-model',
    alt: 'Modelo com vestido fluido em estampa ondulada contemporânea',
    crop: { left: 0, top: 0, bottom: 27, right: 0 },
  },
  {
    file: '08_favorites_week_textile.png',
    slug: 'favorites-week-textile',
    alt: 'Composição têxtil com padronagens gráficas',
    crop: { left: 0, top: 0, bottom: 27, right: 0 },
  },
  {
    file: '09_blue_dress_detail.png',
    slug: 'blue-dress-detail',
    alt: 'Detalhe do busto e caimento de vestido em tons de azul',
    crop: { left: 0, top: 0, bottom: 27, right: 0 },
  },
  {
    file: '10_navy_jumpsuit_model.png',
    slug: 'navy-jumpsuit-model',
    alt: 'Modelo com macacão alfaiataria em azul marinho com faixa de amarração',
    crop: { left: 0, top: 0, bottom: 0, right: 0 },
  },
  {
    file: '11_blue_pattern_model.png',
    slug: 'blue-pattern-model',
    alt: 'Vestido longo com estampa botânica em nuances de azul e branco',
    crop: { left: 0, top: 0, bottom: 0, right: 0 },
  },
  {
    file: '12_store_rack_interior.png',
    slug: 'store-rack-interior',
    alt: 'Interior da loja com iluminação suave e araras organizadas por cartela de cores',
    crop: { left: 0, top: 0, bottom: 27, right: 0 },
  },
  {
    file: '13_pink_dress_model.png',
    slug: 'pink-dress-model',
    alt: 'Vestido longo feminino em estampa aquarelada com tons de rosa antigo e coral',
    crop: { left: 0, top: 0, bottom: 0, right: 0 },
  },
  {
    file: '14_crochet_dress_detail.png',
    slug: 'crochet-dress-detail',
    alt: 'Detalhe artesanal dos pontos e tramas em crochê manual',
    crop: { left: 0, top: 0, bottom: 0, right: 0 },
  },
  {
    file: '15_colorways_product_card.png',
    slug: 'colorways-product-card',
    alt: 'Cartela de tonalidades e composições da linha de malharia',
    crop: { left: 0, top: 0, bottom: 0, right: 0 },
  },
  {
    file: '16_striped_outfit_model.png',
    slug: 'striped-outfit-model',
    alt: 'Conjunto clássico listrado em tons claros de off-white e linho',
    crop: { left: 0, top: 0, bottom: 27, right: 0 },
  },
  {
    file: '17_pink_dress_alt_pose.png',
    slug: 'pink-dress-alt-pose',
    alt: 'Vestido longo estampado em movimento fluido',
    crop: { left: 0, top: 0, bottom: 27, right: 0 },
  },
  {
    file: '18_blue_evening_model.png',
    slug: 'blue-evening-model',
    alt: 'Vestido longo em azul royal acetinado para ocasiões especiais',
    crop: { left: 0, top: 0, bottom: 27, right: 0 },
  },
];

async function processAll() {
  const manifest = [];

  for (const item of imageConfigs) {
    const srcPath = path.join(refDir, item.file);
    if (!fs.existsSync(srcPath)) {
      console.warn('Arquivo não encontrado:', srcPath);
      continue;
    }

    const image = sharp(srcPath);
    const meta = await image.metadata();

    const cropLeft = item.crop.left;
    const cropTop = item.crop.top;
    const cropWidth = meta.width - cropLeft - item.crop.right;
    const cropHeight = meta.height - cropTop - item.crop.bottom;

    const pipeline = image.extract({
      left: cropLeft,
      top: cropTop,
      width: cropWidth,
      height: cropHeight,
    });

    const webpFilename = `${item.slug}.webp`;
    const avifFilename = `${item.slug}.avif`;
    const webpPath = path.join(outDir, webpFilename);
    const avifPath = path.join(outDir, avifFilename);

    await pipeline.clone().webp({ quality: 85, effort: 6 }).toFile(webpPath);
    await pipeline.clone().avif({ quality: 80, effort: 6 }).toFile(avifPath);

    const webpStat = fs.statSync(webpPath);
    const avifStat = fs.statSync(avifPath);

    manifest.push({
      originalFile: item.file,
      slug: item.slug,
      alt: item.alt,
      originalDimensions: { width: meta.width, height: meta.height },
      cropApplied: { left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight },
      outputDimensions: { width: cropWidth, height: cropHeight },
      webp: {
        filename: webpFilename,
        path: `/brands/precioza/processed/${webpFilename}`,
        bytes: webpStat.size,
      },
      avif: {
        filename: avifFilename,
        path: `/brands/precioza/processed/${avifFilename}`,
        bytes: avifStat.size,
      },
    });

    console.log(`✓ Processado ${item.slug}: ${cropWidth}x${cropHeight} (WebP: ${(webpStat.size/1024).toFixed(1)} KB, AVIF: ${(avifStat.size/1024).toFixed(1)} KB)`);
  }

  const manifestPath = path.join(outDir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`\nManifest gerado com sucesso em: ${manifestPath}`);
}

processAll().catch(err => {
  console.error('Erro no processamento de imagens:', err);
  process.exit(1);
});
