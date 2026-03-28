import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Jimp } from 'jimp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = 'C:\\Users\\ahmed\\.gemini\\antigravity\\brain\\c7b59391-640a-427c-9d88-481dc2c83e7d';
const outputDir = path.join(__dirname, 'public', 'generated');

async function processImages() {
  const files = fs.readdirSync(inputDir).filter(f => f.includes('_green_') && f.endsWith('.png'));

  if (files.length === 0) {
      console.log("No green screen files found to process.");
      return;
  }

  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file.replace('_green_', '_transparent_'));
    
    console.log(`Processing ${file}...`);
    
    try {
      // In Jimp 1.0 (latest ESM), we use Jimp.read. In <1.0 we use Jimp.read or default import.
      let image;
      try {
        image = await Jimp.read(inputPath);
      } catch (e) {
        // Fallback for older jimp
        const jimpModule = await import('jimp');
        const JimpFallback = jimpModule.default || jimpModule.Jimp;
        image = await JimpFallback.read(inputPath);
      }
      
      image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
        const r = this.bitmap.data[idx];
        const g = this.bitmap.data[idx + 1];
        const b = this.bitmap.data[idx + 2];
        
        // Pure green tolerance
        if (g > 150 && r <= 100 && b <= 100) {
          this.bitmap.data[idx + 3] = 0; 
        } else if (g > Math.max(r, b) && (g - Math.max(r, b)) > 20) {
           const factor = (g - Math.max(r, b)) / 255;
           this.bitmap.data[idx + 3] = Math.max(0, 255 - (factor * 255 * 2.5));
           this.bitmap.data[idx + 1] = Math.max(r, b); 
        }
      });
      
      await image.write(outputPath);
      console.log(`Saved transparent image to ${outputPath}`);
    } catch (e) {
      console.error(`Failed to process ${file}:`, e);
    }
  }
}

processImages();
