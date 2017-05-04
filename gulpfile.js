var gulp = require("gulp");
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var concatCss = require('gulp-concat-css');
var uglifycss = require('gulp-uglifycss');

gulp.task('sass', function() {
  return gulp.src('./src/client/stylesheets/*.sass')
// looks for sass files in public_dev/stylesheets and its subdirectories
    .pipe(sass().on('error', sass.logError)) // shows errors if there are any
    .pipe(autoprefixer({ // autoprefixer
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(concatCss("site.css")) // concatenates all files in one big file
    .pipe(uglifycss({ // uglifies and saves space
      "max-line-len": 80
    }))
    .pipe(gulp.dest('./src/client/stylesheets/')); // output file directory
});

gulp.task('watch', function() {
  gulp.watch('./src/client/stylesheets/*.sass', ['sass']);
// if you change any of the files under the public_dev/stylesheets directory
// and its subdirectories, it'll run gulp automatically.
});

// Default Task
gulp.task('default', ['sass', 'watch']);
