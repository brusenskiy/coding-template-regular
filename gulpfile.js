var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var jade = require('gulp-jade');
var html2jade = require('gulp-html2jade');
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var fontmin = require('fontmin');

var browserSync = require('browser-sync');
var reload = browserSync.reload;

var buildDir = './build';
var staticDir = buildDir + '/static';
var staticImages = staticDir + '/images';

gulp.task('jade', function() {
  return gulp.src('./src/jade/*.jade')
    .pipe(jade({'pretty': true}))
    .pipe(gulp.dest(buildDir));
});

gulp.task('jade:watch', ['jade'], function() {
  return gulp.watch(['./src/jade/*.jade', './src/jade/*/*.jade'], ['jade']);
});

gulp.task('scss', function() {
  return gulp.src('./src/scss/*.scss')
    .pipe(sass())
    .pipe(sourcemaps.init())
    .pipe(cssnano())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(staticDir + '/styles'));
});

gulp.task('scss:watch', ['scss'], function() {
  return gulp.watch(['./src/scss/*.scss', './src/scss/*/*.scss'], ['scss']);
});

gulp.task('js', function() {
  return gulp.src('./src/js/*.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(staticDir + '/scripts'))
});

gulp.task('js:watch', ['js'], function() {
  return gulp.watch('./src/js/*.js', ['js']);
});

gulp.task('images', function() {
  return gulp.src(['./src/images/*', './src/images/*/*'])
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest(staticImages));
});

//gulp.task('fonts', function() {
//  var f = './src/fonts/*.';
//  return gulp.src([f + 'eot', f + 'woff', f + 'svg', f + 'ttf', f + 'otf'])
//    .pipe(gulp.dest(staticDir + '/fonts'));
//});


//gulp.task('build', ['jade', 'scss', 'js', 'images', 'fonts']);
gulp.task('build', ['jade', 'scss', 'js', 'images']);
gulp.task('watch', ['jade:watch', 'scss:watch', 'js:watch']);

gulp.task('dev-server', ['watch'], function() {
  browserSync({
    server: {baseDir: buildDir}
    //browser: 'Google Chrome'
  });
  gulp.watch(['*', 'static/**/**'], {cwd: buildDir}, reload);
});
