const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeImage(inputPath, outputPath) {
  try {
    const stats = fs.statSync(inputPath);
    const originalSize = stats.size;

    await sharp(inputPath)
      .webp({ 
        quality: 80,
        effort: 6,
        lossless: false,
        smartSubsample: true
      })
      .toFile(outputPath);

    const newStats = fs.statSync(outputPath);
    const newSize = newStats.size;
    const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);

    console.log(`Optimized ${path.basename(inputPath)}: ${(originalSize/1024).toFixed(1)}KB → ${(newSize/1024).toFixed(1)}KB (${savings}% reduction)`);
  } catch (error) {
    console.error(`Error optimizing ${inputPath}:`, error);
  }
}

async function optimizeAllImages() {
  const imagesDir = path.join(__dirname, '../public/images');
  const optimizedDir = path.join(imagesDir, 'optimized');

  // Create optimized directory if it doesn't exist
  if (!fs.existsSync(optimizedDir)) {
    fs.mkdirSync(optimizedDir);
  }

  const files = fs.readdirSync(imagesDir).filter(file => 
    file.endsWith('.webp') && !file.startsWith('.')
  );

  console.log(`Optimizing ${files.length} images...`);

  for (const file of files) {
    const inputPath = path.join(imagesDir, file);
    const outputPath = path.join(optimizedDir, file);
    
    await optimizeImage(inputPath, outputPath);
  }

  console.log('\nOptimization complete! You can replace the original files with the optimized versions if needed.');
}

optimizeAllImages().catch(console.error);
