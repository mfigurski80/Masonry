const gulp = require('gulp');
const ts = require('gulp-typescript');
const terser = require('gulp-terser');
const concat = require('gulp-concat');


gulp.task('default', () => {
  gulp.watch(['src/**/*.ts', 'src/**/*.js'], gulp.series(['compile-ts']));
});

gulp.task('compile-ts', () => {
  return gulp.src(['src/**/*.ts', 'src/**/*.js'])
    .pipe(ts({
      target: 'es2019',
      allowJs: true
    }))
    .pipe(concat('Masonry.min.js'))
    .pipe(terser())
    .pipe(gulp.dest('./build'));
});
