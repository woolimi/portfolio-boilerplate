import { writeFileSync } from 'fs';
import { join } from 'path';

const outDir = join(process.cwd(), 'out');

// Create .nojekyll file to prevent GitHub Pages from ignoring _next directory
const nojekyllPath = join(outDir, '.nojekyll');
writeFileSync(nojekyllPath, '');
console.log('Created .nojekyll file');
