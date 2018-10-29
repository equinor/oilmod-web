const fs = require('fs');
const path = require('path');

function getDocs(dir, filelist) {
    const files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) {
      filelist = getDocs(p, filelist);
    }
    else if (path.extname(file).toLowerCase() === '.md') {
      filelist.push(p);
    }
  });
  return filelist;
}

const markdowns = getDocs(path.join(__dirname, 'projects'));
const hasDocsDir = fs.existsSync(path.join(__dirname, 'src', 'assets', 'docs'));
if (!hasDocsDir) {
  fs.mkdirSync(path.join(__dirname, 'src', 'assets', 'docs'));
}

// __dirname, 'src', 'assets', 'docs'
markdowns.forEach(file => {
  const base = path.basename(file);
  fs.copyFileSync(file, path.join(__dirname, 'src', 'assets', 'docs', base));
});
