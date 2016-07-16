'use strict';
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    watch = require('gulp-watch'),
    copy = require('gulp-copy'),
    clean = require('gulp-clean'),
    plumber = require('gulp-plumber');

var srcDir = '_src/',
    destDir = 'assets/',
    cssSrcDir = srcDir + 'styles/',
    imgSrcDir = srcDir + 'images/',
    cssDestDir = destDir + 'styles/',
    imgDestDir = destDir + 'images/',
    cssSrcFiles = cssSrcDir + '**/*.scss',
    cssSrcRootFiles = cssSrcDir + '*.scss',
    imgSrcFiles = imgSrcDir + '**/*.*',
    buildTasks = ['css', 'img'];

gulp.task('css', ['clean-css'], function () {
    return gulp.src(cssSrcRootFiles)
        .pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([
            autoprefixer({
                cascade: false,
                remove: false,
                browsers: [
                    'Explorer >= 10',
                    'Edge >= 12',
                    'Opera >= 12',
                    'Firefox >= 22',
                    'Chrome >= 20',
                    'Safari >= 6',
                    'Android >= 4',
                    'iOS >= 7'
                ]
            })
        ]))
        .pipe(gulp.dest(cssDestDir));
});

gulp.task('img', ['clean-img'], function () {
    return gulp.src(imgSrcFiles)
        .pipe(copy(imgDestDir, {
            prefix: countSubdirs(imgDestDir)
        }));
});

gulp.task('clean-img', function () {
    return gulp.src(imgDestDir, {read: false})
        .pipe(clean());
});

gulp.task('clean-css', function () {
    return gulp.src(cssDestDir, {read: false})
        .pipe(clean());
});

gulp.task('clean', ['clean-css', 'clean-img']);

gulp.task('watch', buildTasks, function () {
    gulp.watch(cssSrcFiles, ['css']);
    gulp.watch(imgSrcFiles, ['img']);
});

gulp.task('default', buildTasks);

function countSubdirs(path) {
    path = path.replace(/\/$/, '') + '/'; // assure trailing slash
    return (path.match(/\//g) || []).length;
}
