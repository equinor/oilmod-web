import { writeFile as writeFileCb } from 'fs';
import * as path from 'path';
import * as sass from 'sass';
import { promisify } from 'util';

const writeFile = promisify(writeFileCb);

const root = path.join(__dirname, '../../');
const out = path.join(root, 'dist', 'libs', 'core');

const promises = [
  processScss(
    './libs/core/src/ngx-stoui.scss',
    path.join(out, 'ngx-stoui.css'),
  ),
  processScss(
    './libs/core/src/style/datatable/ngx-datatable.scss',
    path.join(out, 'ngx-datatable.css'),
  ),
];

Promise.all(promises).then(() => console.log('Done'));

async function processScss(file: string, outFile: string): Promise<void> {
  const result = await sass.compileAsync(file, {
    loadPaths: [path.join(root, 'node_modules')],
  });

  const css = result.css.toString();
  await writeFile(path.join(outFile), css, 'utf8');
}
