## UI Library for TOPS-IM (GLI+GLL)

### Installation
This package is published on a private npm registry hosted at docker server (ai-linapp1022). To install, you need to change your npm / yarn registry:
``npm set registry http://ai-linapp1022.statoil.no:4873`` or ``yarn config set registry http://ai-linapp1022.statoil.no:4873``

To install the package, run `yarn add ngx-stoui`

### Local development

* Run `gulp` to create an initial build
* copy package.json to dist
* run `gulp watch` to watch typescript and sass files
* Enter `dist` and run `npm link`
* Open your project, and run `npm link ngx-stoui`
* Start working

### TODOS:
* Add gulp-cache for faster rebuilds
* Implement versioning in gulp flow
  * Something like `gulp.task('release', ['build', 'version', 'release'])`
* Minify css
* Sourcemaps