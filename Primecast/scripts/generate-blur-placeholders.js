const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateBlurPlaceholder(imagePath) {
  try {
    const buffer = await sharp(imagePath)
      .resize(10, 10)
      .blur(1)
      .jpeg({ quality: 30 })
      .toBuffer();
    
    return `data:image/jpeg;base64,${buffer.toString('base64')}`;
  } catch (error) {
    console.error(`Error generating blur placeholder for ${imagePath}:`, error);
    return null;
  }
}

async function generateAllBlurPlaceholders() {
  const imagesDir = path.join(__dirname, '../public/images');
  const images = [
    'Ted Lasso.webp',
    'the last of us.webp',
    'House of the Dragon.webp',
    "Clarkson's Farm.webp",
    'Cold Case_ The Tylenol Murders.webp',
    'MobLand.webp',
    'A Working Man.webp'
  ];

  const blurData = {};

  for (const image of images) {
    const imagePath = path.join(imagesDir, image);
    if (fs.existsSync(imagePath)) {
      console.log(`Generating blur placeholder for ${image}...`);
      const blurDataUrl = await generateBlurPlaceholder(imagePath);
      if (blurDataUrl) {
        blurData[image] = blurDataUrl;
      }
    } else {
      console.warn(`Image not found: ${imagePath}`);
    }
  }

  // Write to a JSON file
  const outputPath = path.join(__dirname, '../src/data/blur-placeholders.json');
  fs.writeFileSync(outputPath, JSON.stringify(blurData, null, 2));
  
  console.log('Blur placeholders generated successfully!');
  console.log(`Output saved to: ${outputPath}`);
}

generateAllBlurPlaceholders().catch(console.error);