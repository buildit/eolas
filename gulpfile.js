const del = require('del');
const gulp = require('gulp');
const rename = require('gulp-rename');
const template = require('gulp-template');

gulp.task('clean', () => (
  del(['dist'])
));

gulp.task('gen_config', () => {
  const databaseURL = process.env.DB_URL || 'mongodb://localhost:27017';
  const context = process.env.CONTEXT || 'test';
  const serverURL = process.env.SERVER_URL || 'localhost';
  const serverPort = process.env.SERVER_PORT || '80';
  const logLevel = process.env.LOG_LEVEL || 'INFO';
  const version = process.env.VERSION || 'unknown';

  gulp.src('./config/deployment_template.json')
    .pipe(template({ eolas_version: `${version}`, databaseurl: `${databaseURL}`, dbcontext: `${context}`, serverurl: `${serverURL}`, serverport: `${serverPort}`, loglevel: `${logLevel}` }))
    .pipe(rename(`${context}` + '.json'))
    .pipe(gulp.dest('./config'));
});

gulp.task('config', ['clean'], () => {
  const databaseURL = process.env.DB_URL || 'mongodb://localhost:27017';
  const serverURL = process.env.SERVER_URL || 'localhost';
  const serverPort = process.env.SERVER_PORT || '80';
  const logLevel = process.env.LOG_LEVEL || 'INFO';
  const version = process.env.VERSION || 'unknown';

  gulp.src('./config/deployment_template.json')
    .pipe(template({ eolas_version: `${version}`, databaseurl: `${databaseURL}`, dbcontext: `staging`, serverurl: `${serverURL}`, serverport: `${serverPort}`, loglevel: `${logLevel}` }))
    .pipe(rename('staging.json'))
    .pipe(gulp.dest('./dist/config'));
  gulp.src('./config/deployment_template.json')
    .pipe(template({ eolas_version: `${version}`, databaseurl: `${databaseURL}`, dbcontext: `production`, serverurl: `${serverURL}`, serverport: `${serverPort}`, loglevel: `${logLevel}` }))
    .pipe(rename('production.json'))
    .pipe(gulp.dest('./dist/config'));
  gulp.src('./config/log4js_config.json')
    .pipe(gulp.dest('./dist/config'));
});

gulp.task('package', ['clean', 'config'], () => {
  gulp.src('./api_doc/**/*.json')
  .pipe(gulp.dest('./dist/api_doc'));
  gulp.src('./routes/*.js')
  .pipe(gulp.dest('./dist/routes'));
  gulp.src('./services/**/*.js')
  .pipe(gulp.dest('./dist/services'));
  gulp.src('./util/*.js')
  .pipe(gulp.dest('./dist/util'));
  gulp.src('./index.js')
  .pipe(gulp.dest('./dist'));
  gulp.src('./package.json')
  .pipe(gulp.dest('./dist'));
  gulp.src('./npm-shrinkwrap.json')
  .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['package']);
