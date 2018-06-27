const gulp = require('gulp');
const ngc = require('./gulp-ngc');
const inlineNg2Template = require('gulp-inline-ng2-template');
const sass = require('node-sass');
const tildeImporter = require('node-sass-tilde-importer');
const gSass = require('gulp-sass');
const fs = require('fs');
const glob = require('glob');
const path = require('path');
const runSequence = require('run-sequence');
const del = require('del');
const rollup = require('rollup-stream');
const source = require('vinyl-source-stream');
const copyPackageJson = require('./postbump');

const globals = {
  'rxjs/Observable': 'Rx',
  'rxjs/Subject': 'Rx',
  'rxjs/add/operator/debounceTime': 'Rx.Observable.prototype',
  'date-fns': 'dateFns',
  '@angular/core': 'ng.core',
  '@angular/animations': 'ng.animations',
  '@angular/router': 'ng.router',
  '@angular/http': 'ng.http',
  '@angular/platform-browser': 'ng.platformBrowser',
  '@angular/forms': 'ng.forms',
  '@angular/common': 'ng.common',
  'moment': 'moment'
};

const copyFiles = [
  './_variables.scss',
  './_mixins.scss',
  './vendor/bootstrap/**/_variables.scss',
  './vendor/font-awesome/scss/_variables.scss',
  './vendor/_material_angular_variables.scss',
  './style/**/*.scss',
  './vendor/material-icons/**/*'
];

gulp.task('inline', function() {
  return gulp.src('components/**/*.ts')
    .pipe(inlineNg2Template({
      useRelativePaths: true,
      styleProcessor: compileSass
    }))
    .pipe(gulp.dest('./build'));
});

gulp.task('index', function(cb) {
  const dir = path.join(__dirname, 'build');
  glob('**/*.ts', { cwd: dir}, function(err, files) {
    let indexContents = files.filter(file => !file.match(/index\.ts$/)).map(file => `export * from './build/${file.replace('.ts', '')}'`);
    fs.writeFile('index-esm.ts', indexContents.join('\n'), err => {
      cb(err);
    });
  });
});

gulp.task('clean', function() {
  return del(['dist', 'build', 'index-esm.ts']);
});

gulp.task('copy', function() {
  return gulp.src(copyFiles)
    .pipe(gulp.dest(function(file) {
      var destination = file.base.replace('ngx-stoui', 'ngx-stoui\\dist');
      return destination;
    }));
});


gulp.task('clean-temp', function() {
  return del(['build', 'index-esm.ts']);
});

gulp.task('compile', function() {
  return ngc(['-p', 'tsconfig.build.json']);
});

gulp.task('watch:sass', function() {
  gulp.watch(['./ngx-stoui.scss', './style/**/*.scss', './components/**/*.scss'], ['sass', 'copy'])
});

gulp.task('watch:ts', function() {
  gulp.watch(['index.ts', 'components/**/*', 'vendor/**/*.ts'], ['build:ts']);
});

gulp.task('watch', ['watch:ts', 'watch:sass']);

gulp.task('build:ts', function(cb) {
  runSequence(
    'inline',
    'index',
    'compile',
    cb
  );
});

gulp.task('build', function(cb) {
  runSequence(
    'inline',
    'index',
    'compile',
    'copy',
    'sass',
    'clean-temp',
    cb
  );
});

gulp.task('default', ['clean'], function(cb) {
  runSequence(
    'build',
    'packagejson',
    cb
  );
});

gulp.task('packagejson', function(cb) {
  copyPackageJson()
    .then(() => cb())
});

gulp.task('sass', function() {
  return gulp.src('./ngx-stoui.scss')
    .pipe(gSass({
      importer: tildeImporter
    }).on('error', gSass.logError))
    .pipe(gulp.dest('./dist'))
});

gulp.task('bundle', function() {
  return rollup({
    entry: 'dist/index-esm.js',
    sourceMap: true,
    exports: 'named',
    format: 'es',
    external: Object.keys(globals),
    globals,
    onwarn: function ( message ) {
      if (message.code !== 'THIS_IS_UNDEFINED') {
        console.log(message);
      }
    }
  }).pipe(source('bundle.esm.js'))
    .pipe(gulp.dest('dist'));
});

function compileSass(path, ext, file, cb) {
  sass.render({ file: path, outputStyle: 'compressed' }, function (err, result) {
    cb(err, result.css.toString());
  });
}
