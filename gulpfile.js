// npm install --save-dev gulp-sourcemaps, gulp-sass, gulp-concat, gulp-uglify, gulp-postcss, autoprefixer, cssnano, browser-sync, gulp-replace

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass')
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const browserSync = require('browser-sync').create();
var replace = require('gulp-replace');


const files = {
    scssPath: './_html/sass/**/*.sass',
    jsPath: './_html/js/**/*.js'
}

function scssTask() {
  return gulp.src(files.scssPath)
    .pipe(sourcemaps.init()) // initialize sourcemaps first
    .pipe(sass()) // compile SCSS to CSS
    .pipe(postcss([ autoprefixer(), cssnano() ])) // PostCSS plugins
    .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
    .pipe(gulp.dest('./_html/dist/'))
    .pipe(browserSync.stream());
}

function jsTask() {
	return gulp.src([
		files.jsPath
		])
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./_html/dist/'));

}

function browserReloadTask(done) {
  browserSync.reload();
  done();
}


function watchTask() {
  gulp.watch("./_html/sass/**/*", scssTask);
  gulp.watch("./_html/js/**/*.js", jsTask);
  gulp.watch("./_html/**/*.html", browserReloadTask);
  gulp.watch("./_html/**/*.php", browserReloadTask);
}

function syncTask() {
  browserSync.init({
    server: {
      baseDir: "./_html/"
    },
    port: 3003
  })
}

exports.default = gulp.parallel(syncTask, watchTask);
