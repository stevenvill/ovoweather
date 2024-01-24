const { src, dest, watch, series } = require('gulp')

const gulp        = require('gulp')
const concat      = require('gulp-concat')
const uglify      = require('gulp-uglify')
const cssnano     = require('gulp-cssnano')
const imagemin    = require('gulp-imagemin')
const htmlmin     = require('gulp-htmlmin')
const sourcemaps  = require('gulp-sourcemaps')
const cache       = require('gulp-cache')
const del         = require('del')
const browserSync = require('browser-sync').create()

// Tasks 
function connectDev(cb) {
 	browserSync.init({
    proxy: "localhost:3000",
    port: 3001,
    notify: true
 	})
 	cb()
}

function watchFiles(cb) {
  watch('assets/css/*.css', css)
  watch('assets/*.html', html)
  watch('assets/js/*.js', js)
  cb()
}

function js(cb) {
  src('assets/js/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(dest('dist/js'))
  cb()
}

function css(cb) {
  src('assets/css/*.css')
    .pipe(sourcemaps.init())
    .pipe(concat('style.css'))
    .pipe(cssnano())
    .pipe(sourcemaps.write())
    .pipe(dest('dist/css'))
  cb()
}

function images(cb) {
  src('assets/img/*.+(png|jpg|gif|svg)')
    .pipe(cache(imagemin()))
    .pipe(dest('dist/img'))
  cb()
}

function html(cb) {
  src(['assets/**/*.html'])
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(dest('dist'))
  cb()
}

function cleanDist(cb) {
  del.sync('dist')
  cb()
}

// Build Sequences
exports.default = series(cleanDist, html, css, images, js, connectDev, watchFiles)
exports.build = series(cleanDist, html, css, images, js)