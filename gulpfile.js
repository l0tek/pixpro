const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const replace = require('gulp-replace');
const browsersync = require('browser-sync').create();

function scssTask(){
    return src('src/scss/styles.scss', { sourcemaps: true })
        .pipe(sass())
        .pipe(postcss([cssnano()]))
        .pipe(dest('src/css', { sourcemaps: '.' }))
}

function jsTask(){
    return src(['node_modules/bootstrap/dist/js/bootstrap.bundle.js'])
            .pipe(dest("src/js"));             
}


var cbString = new Date().getTime();
function cacheBustTask(){
    return src(['src/index.html'])
        .pipe(replace(/cb=\d+/, 'cb=' + cbString))
        .pipe(dest('./src'));
}



function browsersyncServe(cb){
    browsersync.init({
      server: {
        baseDir: './src'
      }    
    });
    cb();
 }

  function browsersyncReload(cb){
    browsersync.reload();
    cb();
}

// Watch Task
function watchTask(){
    watch('src/*.html', browsersyncReload);
    watch(['src/**/*.scss'], series(scssTask, browsersyncReload));
  }

  // Default Gulp Task
exports.default = series(
    scssTask,
    jsTask,
    cacheBustTask,
    browsersyncServe,
    watchTask
  );


