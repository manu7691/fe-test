//Include dependencies

var gulp = require('gulp'),
    // Help with files and relatives paths
    flatten = require('gulp-flatten'),
    // Process SASS - CSS
    sass = require('gulp-sass'),
    concatCss = require('gulp-concat-css'),
    cleanCSS = require('gulp-clean-css'),
    // Process JS
    concat = require('gulp-concat'),
    cleanJS = require('gulp-uglify'),
    // Webserver
    webserver = require('gulp-webserver');


// Grab libraries files from bower_components
gulp.task('collect-components', function() {

    var path = 'bower_components/**/';
    gulp.src([
        path+'angular.min.js'
    ])
        .pipe(flatten())
        .pipe(gulp.dest('static_dev/js/'));

    gulp.src(['bower_components/**/*.min.css'])
        .pipe(flatten())
        .pipe(gulp.dest('static_dev/css'));

});

// Build minified js files
gulp.task('build-js',function(){
     gulp.src('static_dev/js/*.js')
        .pipe(concat('master.min.js'))
        .pipe(cleanJS())
        .pipe(flatten())
        .pipe(gulp.dest('static/js/'));
});

// Build css from sass files
gulp.task('build-sass',function(){
    gulp.src('static_dev/sass/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('static_dev/css'));
});

// Build minified css
gulp.task('build-css',['build-sass'],function(){
     gulp.src('static_dev/css/*.css')
        .pipe(concatCss('master.min.css'))
        .pipe(cleanCSS({ keepSpecialComments : 0, debug: true }, function(details) {
             console.log(details.name + ': ' + details.stats.originalSize);
             console.log(details.name + ': ' + details.stats.minifiedSize);
         }))
        .pipe(flatten())
        .pipe(gulp.dest('static/css/'));
});

// Build JS and CSS
gulp.task('build',['build-js','build-css']);

// Watch CSS/SASS/JS and templates to trigger reload
gulp.task('watch', function () {
    gulp.watch(['static_dev/css/*','static_dev/sass/*'],['build-css']);
    gulp.watch(['static_dev/js/*'],['build-js']);
});

// Run webserver with livereload to better development
gulp.task('run', ['collect-components','build','watch'], function() {
    gulp.src('.')
        .pipe(webserver({
            livereload: true,
            directoryListing: false,
            open:true,
            fallback: 'index.html'
        }));
});

// Default task - Run webserver
gulp.task('default',['run']);