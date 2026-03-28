import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const SRC = path.join(root, 'SharePoint_PDF_with_associated_MD');
const DEST = path.join(root, 'public', 'SharePoint_PDF_with_associated_MD');

if (!fs.existsSync(SRC)) {
  console.warn('copy-md-archive-to-public: SharePoint_PDF_with_associated_MD not found, skipping.');
  process.exit(0);
}

fs.mkdirSync(path.join(root, 'public'), { recursive: true });
fs.cpSync(SRC, DEST, { recursive: true });
console.log('Copied SharePoint_PDF_with_associated_MD → public/SharePoint_PDF_with_associated_MD');
