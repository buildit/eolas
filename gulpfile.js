const del = require('del');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const mocha = require('gulp-mocha');
const rename = require('gulp-rename');
const gulpNSP = require('gulp-nsp');

gulp.task('clean', () => (
  del(['dist'])
));

gulp.task('lint', () => {
  return gulp.src('**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('package', ['clean'], () => {
  gulp.src('./config/production.json')
    .pipe(rename('config.json'))
    .pipe(gulp.dest('./dist/config'));
  gulp.src('./routes/*.js')
  .pipe(gulp.dest('./dist/routes'));
  gulp.src('./services/*.js')
  .pipe(gulp.dest('./dist/services'));
  gulp.src('./index.js')
  .pipe(gulp.dest('./dist'));
});

gulp.task('test', function () {
  return gulp.src('./test/*.js', { read: false })
      .pipe(mocha({reporter: 'dot'}))
      .once('error', () => {
          process.exit(1);
      })
      .once('end', () => {
          process.exit();
      });
});

gulp.task('accept', function () {
  return gulp.src('./test_accept/*.js', { read: false })
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
