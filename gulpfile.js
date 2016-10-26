'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require("browser-sync").create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var spritesmith = require('gulp.spritesmith');

var path = {
  build: { //Тут мы укажем куда складывать готовые после сборки файлы
    html: 'build/',
    js: 'build/js/',
    css: 'build/css/',
    img: 'build/img/',
    fonts: 'build/fonts/'
  },
  src: { //Пути откуда брать исходники
    html: 'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
    js: 'src/js/main.js',//В стилях и скриптах нам понадобятся только main файлы
    style: 'src/style/main.scss',
    css: 'src/css/',
    img: 'src/img/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
    fonts: 'src/fonts/**/*.*'
  },
  watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
    html: 'src/**/*.html',
    js: 'src/js/**/*.js',
    style: 'src/style/**/*.scss',
    img: 'src/img/**/*.*',
    fonts: 'src/fonts/**/*.*'
  },
  clean: './build'
};

gulp.task('sass', function(){
  return gulp.src(path.src.style)
    .pipe(sass())
    .pipe(gulp.dest(path.src.css))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('watch', ['browserSync', 'sass'], function(){
  gulp.watch(path.src.style, ['sass']);
  gulp.watch(path.src.html, browserSync.reload);
  gulp.watch(path.src.js, browserSync.reload);
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'src'
    },
  })
});

gulp.task('useref', function(){
  return gulp.src(path.src.html)
    .pipe(useref())
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulpIf(['js/*.js', '!js/selectivizr.js'], uglify()))
    .pipe(gulp.dest(path.build.html))
});

gulp.task('images', function(){
  return gulp.src(path.src.img +'(png|jpg|gif|svg)')
  .pipe(cache(imagemin()))
  .pipe(gulp.dest(path.build.img))
});

gulp.task('sprite', function () {
  var spriteData = gulp.src('src/img/sprites/*.png')
    .pipe(spritesmith({
      imgName: '../img/sprite.png',
      cssName: '_sprite.scss',
      padding: 2
    }));
  spriteData.img.pipe(gulp.dest('src/img'));
  spriteData.css.pipe(gulp.dest('src/style'));
});

gulp.task('fonts', function() {
  return gulp.src(path.src.fonts)
  .pipe(gulp.dest(path.build.fonts))
});

gulp.task('clean:build', function() {
  return del.sync('build');
});

gulp.task('build', function (callback) {
  runSequence('clean:build',
    ['sass', 'useref', 'images', 'fonts'],
    callback
  )
});

gulp.task('default', function (callback) {
  runSequence(['sass','browserSync', 'watch'],
    callback
  )
});
