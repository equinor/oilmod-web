const fs = require('fs');

fs.readFile('./package.json', (err, data) => {
  if (err) {
    throw err;
  }
  const package = JSON.parse(data);
  let newPackage = {
    "devDependencies": {},
    "dependencies": { 'date-fns': '^1.28.5' }
  };
  newPackage = Object.assign({}, package, newPackage);
  fs.writeFile('./dist/package.json', JSON.stringify(newPackage), 'utf8', err => {
    if (err) {
      throw err;
    }
    console.log('New package.json created');
  })
});