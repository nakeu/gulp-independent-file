var fs = require('fs'), 
    path = require('path'),
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    babel = require("gulp-babel"), //新增ES6 
    es2015 = require("babel-preset-es2015"), //新增ES6
    // config = require('./config.js'),
    // filePath = config.filePath;
    stylePath = 'src/sass',
    scriptsPath = 'src/scripts';

function swallowError(error) {
    // If you want details of the error in the console
  console.error(error.toString())

  this.emit('end')
}

function getFolders(dir) {
    return fs.readdirSync(dir)
      .filter(function(file) {
        return fs.statSync(path.join(dir, file)).isDirectory();
      });
}

// Styles
gulp.task('styles', function() {
  var folders = getFolders(stylePath);
  var tasks = folders.map(function(folder) {
      return gulp.src(path.join(stylePath, folder, '/*.scss'))
      .pipe(sass())
      .on('error', swallowError)
      .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
      .pipe(rename(folder + '.min.css'))
      .pipe(minifycss())
      .pipe(gulp.dest('assets/css/'))
      .pipe(notify({ message: 'Css task complete' }));
  });
});

// Scripts
gulp.task('scripts', function() {
  
  var folders = getFolders(scriptsPath);

   var tasks = folders.map(function(folder) {
      return gulp.src(path.join(scriptsPath, folder, '/*.js'))
        .pipe(babel({presets:[es2015]}))
        .on('error', swallowError)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('all.js'))
        .pipe(rename(folder + '.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('assets/js'))
        .pipe(notify({ message: 'Js task complete' }));
  });


});

// Images
// gulp.task('images', function() {
//   return gulp.src('src/images/*')
//     .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
//     .pipe(gulp.dest('assets/images'))
//     .pipe(notify({ message: 'Images task complete' }));
// });



// Watch
gulp.task('watch', function() {

  var css = getFolders(stylePath);
  var js = getFolders(stylePath);
  var cssTasks = css.map(function(folder) {
      gulp.watch(path.join(stylePath, folder, '/*.scss'), ['styles']);
  });
  var jsTasks = js.map(function(folder) {
      gulp.watch(path.join(scriptsPath, folder, '/*.js'), ['scripts']);
  });

  livereload.listen();
  gulp.watch(['assets/*']).on('change', livereload.changed);

});

// Default task
// gulp.task('default', function() {
//     gulp.start('styles', 'scripts', 'images');
// });