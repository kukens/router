import Jimp from 'jimp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const input = join(__dirname, '..', 'public', 'maskable_icon_x512.png');
const output = join(__dirname, '..', 'public', 'maskable_icon_x192.png');

async function run() {
  try {
    const image = await Jimp.read(input);
    image.resize(192, 192, Jimp.RESIZE_BICUBIC);
    await image.writeAsync(output);
    console.log('Wrote', output);
  } catch (e) {
    console.error('Failed to resize icon:', e);
    process.exitCode = 1;
  }
}

run();
