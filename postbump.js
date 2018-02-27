const fs = require('fs');

fs.readFile('./package.json', 'utf8', (err, data) => {
  if (err) {
    throw err;
  }
  const package = JSON.parse(data);
  let newPackage = {
    "es2015": "./index-esm.js",
    "module": "./index-esm.js",
    "main": "./index-esm.js",
    "typings": "./index-esm.d.ts",
    "devDependencies": {},
    "peerDependencies": package.dependencies,
    "dependencies": {}
  };
  newPackage = Object.assign({}, package, newPackage);
  delete newPackage.dependencies;
  fs.writeFile('./dist/package.json', JSON.stringify(newPackage), 'utf8', err => {
    if (err) {
      throw err;
    }
    console.log('New package.json created');
  })
});