const browserSync = require('browser-sync');
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const { src, dest, series, parallel } = require('gulp');
const reload = browserSync.reload;
const paths = {
  html: {
    src: './src/*.html',
    dest: './app'
  },
  resources: {
    src: './src/assets/**/*',
    dest: './app/assets'
  },
  scss: {
    src: './src/scss/style.scss',
    dest: './app/css',
    watch: './src/scss/**/*.scss'
  },
  script: {
    src: './src/js/scripts.js',
    dest: './app/js'
  },
  server: {
    src: './app/'
  }
};

function exportResourcesTask() {
  return src(paths.resources.src)
    .pipe(dest(paths.resources.dest));
}

function scssTask() {
  return src(paths.scss.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(rename({
      basename: 'app'
    }))
    .pipe(dest(paths.scss.dest))
    .pipe(browserSync.stream());
}

function scriptTask() {
  return src(paths.script.src, { sourcemaps: true })
    .pipe(rename({
      basename: 'app'
    }))
    .pipe(dest(paths.script.dest))
    .pipe(browserSync.stream());
}

function htmlTask() {
  return src(paths.html.src)
    .pipe(dest(paths.html.dest))
    .pipe(browserSync.stream());
}

function watch() {
    browserSync.init({
      server: {
        baseDir: paths.server.src
      }
  });
  // gulp.watch(paths.styles.src, styles); //Reload does not work when I do big changes on scss file
  gulp.watch(paths.scss.watch, scssTask).on('change', reload); //Always reload after a change on scss file
  gulp.watch(paths.script.src, scriptTask);
  gulp.watch(paths.html.src, htmlTask);
}

const build = series(scssTask, scriptTask, htmlTask, exportResourcesTask);
const start = series(build, watch);

exports.resources = exportResourcesTask;
exports.html = htmlTask;
exports.style = scssTask;
exports.script = scriptTask;
exports.watch = watch;
exports.build = build;
exports.start = start;
exports.default = start;