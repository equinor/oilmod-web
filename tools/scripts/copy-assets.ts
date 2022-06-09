import * as path from 'path';
import * as fs from 'fs';

const glob = require('glob');

const root = path.join(__dirname, '../../');
const src = path.join(root, 'libs', 'core', 'src');
const out = path.join(root, 'dist', 'libs', 'core');
const scss = path.join(src, 'style/**/*');

console.log('Running asset-copier');

glob(scss, (err: Error | null, files: Array<string>) => {
  const onlyLocalPath = [
    ...files,
  ]
    .filter(file => !fs.lstatSync(file).isDirectory())
    .map(file => file.replace(`${src}/`, ''));
  const withDest = onlyLocalPath
    .map(source => ( {
      source: path.join(src, source),
      dest: path.join(out, source),
    } ));
  withDest
    .forEach(({ source, dest}) => {
      const exists = fs.existsSync(path.dirname(dest));
      if (!exists) {
        console.log('Create directory', path.dirname(dest))
        fs.mkdirSync(path.dirname(dest), {recursive: true});
      }
      fs.copyFileSync(source, dest);
    });

  console.log('Assets copied');
})
