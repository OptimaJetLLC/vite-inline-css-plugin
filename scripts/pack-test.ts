import signale from 'signale';
import { $ } from 'zx';

const EXPECTED_FILES = ['LICENSE', 'README.md', 'dist/index.d.ts', 'dist/index.js', 'package.json'];

async function packCheck() {
  const result = await $`npm pack --dry-run --json`;
  const files: { path: string }[] = JSON.parse(result.stdout)[0].files;
  const packedFiles = files.map((file) => file.path);
  const missingFiles = EXPECTED_FILES.filter((file) => !packedFiles.includes(file));
  const extraFiles = packedFiles.filter((file) => !EXPECTED_FILES.includes(file));

  if (missingFiles.length > 0 || extraFiles.length > 0) {
    signale.error('The packed package contents do not match the expected file list.');
    missingFiles.forEach((file) => signale.log(`Missing: ${file}`));
    extraFiles.forEach((file) => signale.log(`Unexpected: ${file}`));
    process.exit(1);
  }
}

packCheck();
