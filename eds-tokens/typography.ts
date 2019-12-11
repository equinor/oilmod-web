const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const file = `typography.json`;

async function run() {
  const res = await readFile(path.join(__dirname, file), 'utf8');
  const parsed: Typography = JSON.parse(res);
  const files = Object.keys(parsed)
    .map(section => {
      const filename = `${section}.scss`;
      const contents = Object.keys(parsed[ section ])
        .map(selector => {
          const styles = parsed[ section ][ selector ];
          let css = [ `$${selector}: (` ];
          Object.entries(styles)
            .forEach(([ prop, value ]) => {
              const parsedProp = prop.replace(/[A-Z]/g, (a, b, c) => {
                return `-${a.toLowerCase()}`;
              });
              css = [ ...css, `${parsedProp}: ${value},` ];
            });
          css = [ ...css, ');' ];
          return css.join('\n');
        });
      return {
        filename,
        contents: contents.join('\n\n')
      };
    });
  for ( const f of files ) {
    await writeFile(path.join(__dirname, f.filename), f.contents);
  }
}

( async () => {
  await run();
} )();

interface Typography {
  [ section: string ]: {
    [ selector: string ]: Partial<CSSStyleDeclaration>
  }
}
