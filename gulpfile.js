'use strict';
var gulp = require('gulp'),
    nodepath = require('path'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    scss = require('postcss-scss'),
    url = require('postcss-url'),
    autoprefixer = require('autoprefixer'),
    watch = require('gulp-watch'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    plumber = require('gulp-plumber');

var OS_SLASH = nodepath.sep,
    CSS_SLASH = '/';

var srcDir = '_src/',
    destDir = 'assets/',
    tmpDir = '.tmp/',
    cssSrcDir = srcDir + 'styles/',
    imgSrcDir = cssSrcDir,
    cssDestDir = destDir + 'styles/',
    imgDestDir = destDir + 'images/',
    cssTmpDir = tmpDir + 'styles/',
    cssSrcFiles = cssSrcDir + '**/*.scss',
    cssSrcRootFiles = cssTmpDir + '*.scss',
    imgSrcFiles = imgSrcDir + '**/images/*.*',
    buildTasks = ['css', 'img'];

gulp.task('pre-css', function () {
    return gulp.src(cssSrcFiles)
        .pipe(plumber())
        .pipe(postcss([
            url({url: preCssUrl})
        ], {syntax: scss}))
        .pipe(gulp.dest(cssTmpDir));
});

gulp.task('css', ['pre-css', 'clean-css'], function () {
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
        .pipe(rename(function (path) {
            var dirs = path.dirname.split(OS_SLASH);
            path.dirname = dirs[dirs.length - 2];
        }))
        .pipe(gulp.dest(imgDestDir));
});

gulp.task('clean-img', function () {
    return gulp.src(imgDestDir, {read: false})
        .pipe(clean());
});

gulp.task('clean-css', function () {
    return gulp.src(cssDestDir, {read: false})
        .pipe(clean());
});

gulp.task('clean', ['clean-css', 'clean-img'], cleanTmpDir);

gulp.task('watch', buildTasks, function () {
    gulp.watch(cssSrcFiles, ['css']);
    gulp.watch(imgSrcFiles, ['img']);
});

gulp.task('default', buildTasks, cleanTmpDir);


function cleanTmpDir() {
    return gulp.src(tmpDir, {read: false})
        .pipe(clean());
}

function preCssUrl(path, decl, from, dirname) {
    var dir,
        component,
        asset,
        type = path.split(CSS_SLASH).shift();

    switch (type) {
        case 'images':
            dir = nodepath.relative(cssDestDir, imgDestDir).split(OS_SLASH).join(CSS_SLASH);
            component = dirname.split(OS_SLASH).pop();
            asset = path.split(CSS_SLASH).slice(1).join(CSS_SLASH);
            return [dir, component, asset].join(CSS_SLASH);

        default:
            return path;
    }
}
