const gulp = require('gulp');
const sass = require('gulp-sass');
const tildeImporter = require('node-sass-tilde-importer');
const path = require('path');

const projectName = 'stoui-core';
const distDir = './dist/' + projectName;
const srcDir = `./projects/${projectName}/src`;
const formScss = `./projects/stoui-form/src/lib/sto-form.scss`;
const formCssOutput = './dist/stoui-form';

const copyFiles = [
  '_variables.scss',
  '_mixins.scss',
  'vendor/bootstrap/**/_variables.scss',
  'vendor/font-awesome/scss/_variables.scss',
  'vendor/_material_angular_variables.scss',
  'style/**/*',
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

gulp.task('sass:form', function() {
  return gulp.src(formScss)
    .pipe(sass({
      importer: tildeImporter,
      includePaths: path.join(__dirname, './dist')
    }).on('error', sass.logError))
    .pipe(gulp.dest(formCssOutput))
});

gulp.task('watch', function () {
  return gulp.watch([`${srcDir}/**/*.scss`, formScss], gulp.series(['sass', 'copy', 'sass:form']));
});

gulp.task('default', gulp.series('sass', 'copy'));
