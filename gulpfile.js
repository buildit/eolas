const del = require('del');
const gulp = require('gulp');
const rename = require('gulp-rename');

gulp.task('clean', () => (
  del(['dist'])
));

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
