const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeImage(inputPath, outputPath, options = {}) {
  try {
    const { width = 400, quality = 85 } = options;
    
    await sharp(inputPath)
      .resize(width, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({ quality })
      .toFile(outputPath);
    
    console.log(`✅ Optimized: ${path.basename(inputPath)} -> ${path.basename(outputPath)}`);
  } catch (error) {
    console.error(`❌ Error optimizing ${inputPath}:`, error.message);
  }
}

async function optimizeAllImages() {
  const imagesDir = path.join(__dirname, '../public/images');
  const optimizedDir = path.join(imagesDir, 'optimized');
  
  // Create optimized directory if it doesn't exist
  if (!fs.existsSync(optimizedDir)) {
    fs.mkdirSync(optimizedDir, { recursive: true });
  }

  const images = [
    'Ted Lasso.webp',
    'the last of us.webp',
    'House of the Dragon.webp',
    "Clarkson's Farm.webp",
    'Cold Case_ The Tylenol Murders.webp',
    'MobLand.webp',
    'A Working Man.webp'
  ];

  console.log('🚀 Starting image optimization...\n');

  // Create multiple sizes for responsive loading
  const sizes = [
    { suffix: '-small', width: 300, quality: 80 },
    { suffix: '-medium', width: 400, quality: 85 },
    { suffix: '-large', width: 600, quality: 90 }
  ];

  for (const image of images) {
    const inputPath = path.join(imagesDir, image);
    
    if (fs.existsSync(inputPath)) {
      console.log(`Processing: ${image}`);
      
      for (const size of sizes) {
        const baseName = path.parse(image).name;
        const outputName = `${baseName}${size.suffix}.webp`;
        const outputPath = path.join(optimizedDir, outputName);
        
        await optimizeImage(inputPath, outputPath, {
          width: size.width,
          quality: size.quality
        });
      }
      console.log('');
    } else {
      console.warn(`⚠️  Image not found: ${inputPath}`);
    }
  }

  console.log('🎉 Image optimization complete!');
}

optimizeAllImages().catch(console.error);
