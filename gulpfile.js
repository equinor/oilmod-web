const gulp = require('gulp');
const sass = require('gulp-sass');
const tildeImporter = require('node-sass-tilde-importer');
const path = require('path');

const projectName = 'ngx-stoui';
const distDir = './dist/' + projectName;
const srcDir = `./projects/ngx-stoui/src`;

const copyFiles = [
  '_variables.scss',
  '_mixins.scss',
  'vendor/bootstrap/**/_variables.scss',
  'vendor/font-awesome/scss/_variables.scss',
  'vendor/_material_angular_variables.scss',
  'style/**/*.scss',
  'vendor/material-icons/**/*'
].map(file => `${srcDir}/${file}`);

gulp.task('sass', function() {
  return gulp.src(`${srcDir}/ngx-stoui.scss`)
    .pipe(sass({
      importer: tildeImporter
    }).on('error', sass.logError))
    .pipe(gulp.dest(distDir))
});

gulp.task('copy', function () {
  const outDir = path.join(__dirname, distDir);
  return gulp.src(copyFiles)
    .pipe(gulp.dest(function(file) {
      const base = path.relative(srcDir, file.base);
      const out = path.join(outDir, base);
      return out;
    }))
});

gulp.task('watch', function() {
  gulp.watch(['./ngx-stoui.scss', './style/**/*.scss', './components/**/*.scss'], ['sass', 'copy'])
});

gulp.task('default', [
  'sass',
  'copy'
]);
