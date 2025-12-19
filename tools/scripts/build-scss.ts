import { exec } from 'child_process';
import { watch, writeFile as writeFileCb } from 'fs';
import * as path from 'path';
import * as sass from 'sass';
import { promisify } from 'util';

const writeFile = promisify(writeFileCb);
const execAsync = promisify(exec);

const root = path.join(__dirname, '../../');
const out = path.join(root, 'dist', 'libs', 'core');

const isWatchMode = process.argv.includes('--watch');

const files = [
  {
    input: './libs/core/src/ngx-stoui.scss',
    output: path.join(out, 'ngx-stoui.css'),
  },
  {
    input: './libs/core/src/styles/datatable/_ngx-datatable.scss',
    output: path.join(out, 'ngx-datatable.css'),
  },
];

async function buildAll(): Promise<void> {
  const promises = files.map((f) => processScss(f.input, f.output));

  await Promise.all(promises)
    .then(async () => {
      const timestamp = new Date().toLocaleTimeString();
      console.log(`[${timestamp}] ✓ Compiled`);

      // In watch mode, push core to yalc immediately after CSS compilation
      if (isWatchMode) {
        try {
          await execAsync('yalc push', { cwd: out });
          console.log(`[${timestamp}] ✓ Pushed @ngx-stoui/core to yalc`);
        } catch (err) {
          console.error('✗ Yalc push failed:', (err as Error).message);
        }
      }
    })
    .catch((err) => {
      console.error('✗ Failed:', err.message);
      if (err.formatted) {
        console.error(err.formatted);
      }
      if (!isWatchMode) {
        process.exit(1);
      }
    });
}

async function processScss(file: string, outFile: string): Promise<void> {
  const result = await sass.compileAsync(file, {
    loadPaths: [path.join(root, 'node_modules')],
  });

  const css = result.css.toString();
  await writeFile(path.join(outFile), css, 'utf8');
}

// Initial build
buildAll();

// Watch mode
if (isWatchMode) {
  console.log('Watching for changes...\n');

  const watchDir = path.join(root, 'libs/core/src');
  let debounceTimer: NodeJS.Timeout | null = null;

  watch(watchDir, { recursive: true }, (eventType, filename) => {
    if (filename && filename.endsWith('.scss')) {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      debounceTimer = setTimeout(() => {
        console.log(`\nChange detected in ${filename}`);
        buildAll();
        debounceTimer = null;
      }, 100);
    }
  });
}
