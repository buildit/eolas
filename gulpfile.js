const del = require('del');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const mocha = require('gulp-mocha');
var gulpNSP = require('gulp-nsp');

gulp.task('clean', () => (
  del(['dist'])
));

gulp.task('lint', () => {
  return gulp.src('**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('test', function () {
  return gulp.src('./test/*.js')
      .pipe(mocha({reporter: 'dot'}))
      .once('error', () => {
          process.exit(1);
      })
      .once('end', () => {
          process.exit();
      });
});

gulp.task('nsp', function (cb) {
  gulpNSP({package: __dirname + '/package.json'}, cb);
});

gulp.task('build', ['lint', 'test', 'nsp']);
