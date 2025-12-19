import * as fs from 'fs';
import { glob } from 'glob';
import * as path from 'path';

const root = path.join(__dirname, '../../');
const src = path.join(root, 'libs', 'core', 'src');
const out = path.join(root, 'dist', 'libs', 'core');
// IMPORTANT: glob v9+ treats backslashes as escape chars. Build the pattern with forward slashes
// or set windowsPathsNoEscape to avoid unintended escaping on Windows.
const scss = `${src.replace(/\\/g, '/')}/styles/**/*`;

console.log('Running asset-copier in', root);

/**
 * Files/folders to EXCLUDE from distribution (internal build-only files)
 * These are compiled into ngx-stoui.css or ngx-datatable.css
 */
const excludePatterns = [
  'styles/datatable/', // All datatable source files (compiled into ngx-datatable.css)
  'styles/components/', // All component source files (compiled into ngx-stoui.css)
  'styles/forms/', // Form styles (compiled into ngx-stoui.css)
  'styles/fonts/', // Fonts (compiled into ngx-stoui.css)
  'styles/_tokens.scss', // Internal tokens file
  'styles/_material-theme.scss', // Internal theme file
  'styles/_utilities.scss', // Internal utilities file
  'styles/_overrides.scss', // Internal overrides file
  'styles/index.scss', // Internal index file
];

function shouldExclude(filePath: string): boolean {
  const normalizedPath = filePath.replace(/\\/g, '/');
  return excludePatterns.some((pattern) => {
    if (pattern.endsWith('/')) {
      return normalizedPath.includes(pattern);
    }
    return normalizedPath.endsWith(pattern);
  });
}

(async () => {
  const files = await glob(scss, { windowsPathsNoEscape: true });
  if (!files.length) {
    console.warn('No files matched pattern:', scss);
  } else {
    console.log('Matched', files.length, 'files');
  }

  const source = `${src.replaceAll('\\', '/')}/`;
  const onlyLocalPath = [...files]
    .filter((file) => !fs.lstatSync(file).isDirectory())
    .map((file) => {
      file = file.replaceAll('\\', '/');
      return file.replace(source, '');
    })
    .filter((localPath) => !shouldExclude(localPath));

  console.log(
    `Copying ${onlyLocalPath.length} files (excluded ${files.filter((f) => !fs.lstatSync(f).isDirectory()).length - onlyLocalPath.length} internal files)`,
  );

  const withDest = onlyLocalPath.map((localPath) => ({
    source: path.join(src, localPath),
    dest: path.join(out, localPath),
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
