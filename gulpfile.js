//Include dependencies

var gulp = require('gulp'),
    del = require('del'),
    // Help with files and relatives paths
    flatten = require('gulp-flatten'),
    // Process SASS - CSS
    sass = require('gulp-sass'),
    concatCss = require('gulp-concat-css'),
    cleanCSS = require('gulp-clean-css'),
    // Process JS
    concat = require('gulp-concat'),
    cleanJS = require('gulp-uglify'),
    // Inject sources
    inject = require('gulp-inject'),
    angularFilesort = require('gulp-angular-filesort'),
    // Webserver
    webserver = require('gulp-webserver');


// Grab libraries files from bower_components
gulp.task('collect-components', function() {

   gulp.src([
        'bower_components/**/**/*.min.js','bower_components/**/*.min.js'
   ])
    .pipe(flatten())
        .pipe(gulp.dest('static/js/dependencies/'));

    gulp.src([
        'bower_components/**/**/*.min.js.map','bower_components/**/**/*.sourcemap.map'
    ])
        .pipe(flatten())
        .pipe(gulp.dest('static/js/dependencies/'))

    gulp.src(['bower_components/**/*.min.css','bower_components/**/*.css'])
        .pipe(flatten())
        .pipe(gulp.dest('static_dev/css'));

});

// Build minified js files
gulp.task('build-js',function(){
 return gulp.src('static_dev/js/app/*.js')
        .pipe(concat('all-app.min.js'))
        .pipe(flatten())
        .pipe(cleanJS({compress:true, mangle: false }))
        .pipe(gulp.dest('static/js/'));
});

// Build css from sass files
gulp.task('build-sass',function(){
  return gulp.src('static_dev/sass/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('static_dev/css'));
});

// Build minified css
gulp.task('build-css',['build-sass'],function(){
      gulp.src(['static_dev/css/*.css','!static_dev/css/styles.css'])
        .pipe(concatCss('dependencies.min.css'))
        .pipe(cleanCSS({ keepSpecialComments : 0, debug: true }, function(details) {
             console.log(details.name + ': ' + details.stats.originalSize);
             console.log(details.name + ': ' + details.stats.minifiedSize);
         }))
        .pipe(flatten())
        .pipe(gulp.dest('static/css/'));

    gulp.src(['static_dev/css/styles.css'])
        .pipe(concatCss('styles.min.css'))
        .pipe(cleanCSS({ keepSpecialComments : 0, debug: true }, function(details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(flatten())
        .pipe(gulp.dest('static/css/'));
});

// Build JS and CSS
gulp.task('build',['collect-components','build-js','build-css']);

// Watch CSS/SASS/JS and templates to trigger reload
gulp.task('watch', function () {
     gulp.watch(['static_dev/css/*','static_dev/sass/*'],['build-css']);
     gulp.watch(['static_dev/js/app/*'],['build-js']);
});

gulp.task('inject',function(){
    return gulp.src('./templates/index.html')
        .pipe(inject(
            gulp.src(['static/js/**/*.min.js']).pipe(angularFilesort())
        ))
        .pipe(inject(
            gulp.src(['static/css/*.min.css'])
        ))
        .pipe(gulp.dest(''));

})

// Run webserver with livereload to better development
gulp.task('run',['inject'], function() {

    gulp.src('.')
        .pipe(webserver({
            livereload: true,
            directoryListing: false,
            open:true,
            fallback: 'index.html'
        }));
});

// Default task - Run webserver
gulp.task('default',['run','build']);