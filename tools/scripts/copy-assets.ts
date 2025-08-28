import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

const root = path.join(__dirname, '../../');
const src = path.join(root, 'libs', 'core', 'src');
const out = path.join(root, 'dist', 'libs', 'core');
// IMPORTANT: glob v9+ treats backslashes as escape chars. Build the pattern with forward slashes
// or set windowsPathsNoEscape to avoid unintended escaping on Windows.
const scss = `${src.replace(/\\/g, '/')}/style/**/*`;

console.log('Running asset-copier in', root);

(async () => {
  const files = await glob(scss, { windowsPathsNoEscape: true });
  if (!files.length) {
    console.warn('No files matched pattern:', scss);
  } else {
    console.log('Matched', files.length, 'files');
  }
  const onlyLocalPath = [...files]
    .filter((file) => !fs.lstatSync(file).isDirectory())
    .map((file) => {
      const source = `${src.replaceAll('\\', '/')}/`;
      file = file.replaceAll('\\', '/');
      return file.replace(source, '');
    });
  const withDest = onlyLocalPath.map((source) => ({
    source: path.join(src, source),
    dest: path.join(out, source),
  }));
  withDest.forEach(({ source, dest }) => {
    const exists = fs.existsSync(path.dirname(dest));
    if (!exists) {
      console.log('Create directory', path.dirname(dest));
      fs.mkdirSync(path.dirname(dest), { recursive: true });
    }
    fs.copyFileSync(source, dest);
  });

  console.log('Assets copied');
})();
