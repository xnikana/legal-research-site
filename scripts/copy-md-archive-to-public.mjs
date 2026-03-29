import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const SRC = path.join(root, 'SharePoint_PDF_with_associated_MD');
const DEST = path.join(root, 'public', 'SharePoint_PDF_with_associated_MD');
const BELTON_SRC = path.join(root, 'BeltonCourt_TownMeeting_Transcripts_MD_2026-03-28');
const BELTON_DEST = path.join(root, 'public', 'BeltonCourt_TownMeeting_Transcripts_MD_2026-03-28');

fs.mkdirSync(path.join(root, 'public'), { recursive: true });

if (fs.existsSync(SRC)) {
  fs.cpSync(SRC, DEST, { recursive: true });
  console.log('Copied SharePoint_PDF_with_associated_MD → public/SharePoint_PDF_with_associated_MD');
} else {
  console.warn('copy-md-archive-to-public: SharePoint_PDF_with_associated_MD not found, skipping.');
}

if (fs.existsSync(BELTON_SRC)) {
  fs.cpSync(BELTON_SRC, BELTON_DEST, { recursive: true });
  console.log(
    'Copied BeltonCourt_TownMeeting_Transcripts_MD_2026-03-28 → public/BeltonCourt_TownMeeting_Transcripts_MD_2026-03-28',
  );
} else {
  console.warn(
    'copy-md-archive-to-public: BeltonCourt_TownMeeting_Transcripts_MD_2026-03-28 not found, skipping.',
  );
}
