import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const LUCIDE_REPO = 'https://github.com/lucide-icons/lucide.git';
const CACHE_DIR = path.join(process.cwd(), '.lucide-cache');
const ICONS_SOURCE_DIR = path.join(CACHE_DIR, 'icons');

async function fetchIcons() {
  console.log('🔄 Fetching latest Lucide icons...');

  if (fs.existsSync(CACHE_DIR)) {
    console.log('📂 Cache directory exists, pulling latest changes...');
    try {
      execSync('git fetch origin main && git reset --hard origin/main', {
        cwd: CACHE_DIR,
        stdio: 'inherit',
      });
    } catch {
      console.log('⚠️ Failed to update, re-cloning...');
      fs.rmSync(CACHE_DIR, { recursive: true, force: true });
      cloneRepo();
    }
  } else {
    cloneRepo();
  }

  const svgFiles = fs.readdirSync(ICONS_SOURCE_DIR).filter((f) => f.endsWith('.svg'));
  console.log(`✅ Found ${svgFiles.length} icons`);
}

function cloneRepo() {
  console.log('📥 Cloning Lucide repository (sparse checkout)...');

  fs.mkdirSync(CACHE_DIR, { recursive: true });

  execSync('git init', { cwd: CACHE_DIR, stdio: 'inherit' });
  execSync(`git remote add origin ${LUCIDE_REPO}`, { cwd: CACHE_DIR, stdio: 'inherit' });
  execSync('git config core.sparseCheckout true', { cwd: CACHE_DIR, stdio: 'inherit' });

  fs.writeFileSync(path.join(CACHE_DIR, '.git', 'info', 'sparse-checkout'), 'icons/\n');

  execSync('git pull origin main --depth=1', { cwd: CACHE_DIR, stdio: 'inherit' });
}

fetchIcons().catch(console.error);
