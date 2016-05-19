/**
 * App
 * @version 0.1.1
 * @anthor: hoofei@gmail.com
 */
/* jshint strict: false, quotmark: false */

// Load plugins
const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const del = require('del');
const footer = require('gulp-footer');
const gulpif = require('gulp-if');
const jshint = require('gulp-jshint');
const less = require('gulp-less');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const ts = require('gulp-typescript');
const livereload = require('gulp-livereload');

const pkg = require('./package.json');
var date = new Date();
pkg.date = ('00' + (date.getMonth() + 1)).slice(-2) + '-' +
    ('00' + date.getDate()).slice(-2) + '-' + date.getFullYear() + '  ' + ('00' + date.getHours()).slice(-2) + ':' +
    ('00' + date.getMinutes()).slice(-2) + ':' + ('00' + date.getSeconds()).slice(-2);
var timestamp = ['\n/*',
    ' <%= pkg.name %>',
    ' @version v<%= pkg.version %>',
    ' @date <%= pkg.date %>',
    ' */','\n\n/**AUTHOR:Lam**/\n/**EMAIL:1422015387@QQ.COM**/\n/**OR whatisurname7@GMAIL.COM**/'].join('');

// Config
var toggle = {
    autoprefix: true,
    imagemin: false,
    jshint: true,
    sourcemaps: true
};
var paths = {
    typescripts:['src/typescripts/**/*.ts','src/typescripts/*.ts'],
    scripts: [
        'src/scripts/**/*.js','src/scripts/*.js'
    ],
    styles: 'src/styles/' + pkg.name + '.less',
    images: [
        'src/images/**/*.jpg',
        'src/images/**/*.gif',
        'src/images/**/*.png' 
    ],
    fonts: [
        'components/font-awesome/fonts/FontAwesome.otf',
        'components/font-awesome/fonts/fontawesome-webfont.eot',
        'components/font-awesome/fonts/fontawesome-webfont.svg',
        'components/font-awesome/fonts/fontawesome-webfont.ttf',
        'components/font-awesome/fonts/fontawesome-webfont.woff',
        'components/font-awesome/fonts/fontawesome-webfont.woff2',
        'src/fonts/*',
    ],
    lib: [
        'components/jquery/dist/jquery.min.js'
    ],
    watchs: {
        typescripts:['src/typescripts/**/*.ts','src/typescripts/*.ts'],
        scripts: ['src/scripts/*.js','src/scripts/**/*.js'],
        styles: ['src/styles/**/*.less','src/styles/*.less'],
        dist: 'dist/**/*'
    }
};
var dests = {
    typescripts:'src/scripts',
    styles: './dist/public/stylesheets',
    scripts: './dist/public/javascripts',
    images: './dist/public/images',
    fonts: './dist/public/fonts',
    maps: '../maps'
};
var options = {
    autoprefix: {
        browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']
    },
    fileName: pkg.name,
    less: {
        compress: true
    },
    imagemin: {
        progressive: true
    },
    jshint: '.jshintrc',
    jshintReporter: 'default',
    rename: {
        suffix: '.min'
    }
};

// Tasks
// 通常情况，以下任务是不能修改的，如果遇到特殊情况需要修改，请注明！
// typescripts
gulp.task('typescript',function(){
    gulp.src(paths.typescripts)
    .pipe(ts())
    .pipe(gulp.dest(dests.typescripts));
});

// Styles
gulp.task('styles', function () {
    gulp.src(paths.styles)
        .pipe(plumber({
            errorHandler: notify.onError('Error: <%= error.message %>')
        }))
        .pipe(gulpif(toggle.sourcemaps, sourcemaps.init()))
        .pipe(less(options.less))
        .pipe(gulpif(toggle.autoprefix, autoprefixer(options.autoprefix)))
        .pipe(rename(options.rename))
        .pipe(footer(timestamp, {
            pkg: pkg
        }))
        .pipe(gulpif(toggle.sourcemaps, sourcemaps.write(dests.maps)))
        .pipe(gulp.dest(dests.styles));
});

// Scripts
gulp.task('scripts', function () {
    gulp.src(paths.scripts)
        .pipe(plumber({
            errorHandler: notify.onError('Error: <%= error.message %>')
        }))
        .pipe(gulpif(toggle.sourcemaps, sourcemaps.init()))
        .pipe(gulpif(toggle.jshint, jshint(options.jshint)))
        .pipe(gulpif(toggle.jshint, jshint.reporter(options.jshintReporter)))
        //.pipe(concat(options.fileName + '.js')) //合并js
        .pipe(rename(options.rename)) //重命名js
        .pipe(uglify())
        .pipe(footer(timestamp, {
            pkg: pkg
        }))
        .pipe(gulpif(toggle.sourcemaps, sourcemaps.write(dests.maps)))
        .pipe(gulp.dest(dests.scripts));
});

// Images
gulp.task('images', function () {
    gulp.src(paths.images)
        .pipe(gulp.dest(dests.images));
});

// Fonts
gulp.task('copyFonts', function () {
    gulp.src(paths.fonts)
        .pipe(gulp.dest(dests.fonts));
});


// Lib
gulp.task('copyLib', function () {
    gulp.src(paths.lib)
        .pipe(gulp.dest(dests.scripts));
});

// Clean
gulp.task('clean', function (cb) {
    del(['dist/css', 'dist/js', 'dist/fonts', 'dist/maps'], cb);
});

// Build
gulp.task('build', ['clean'], function () {
    gulp.start('styles', 'scripts', 'images', 'coypFonts', 'copyLib');
});

// Default
gulp.task('default', ['build']);

// Release 发布
gulp.task('release', function () {
    // 因为 UAE 不支持 .map 文件类型，所以暂时在发布时去除 sourcemaps
    toggle.sourcemaps = false;
    gulp.start('build');
});

// Watch
gulp.task('watch', function () {
    // typescript
    gulp.watch(paths.watchs.typescripts,['typescript']);
    // .js files
    gulp.watch(paths.watchs.scripts, ['scripts']);
    // .less files
    gulp.watch(paths.watchs.styles, ['styles']);
    // images files
    gulp.watch(paths.images, ['images']);
    // LiveReload server
    livereload.listen();
    // Watch any files in dist/, reload on change
    gulp.watch(paths.watchs.dist).on('change', livereload.changed);
    // 刷新浏览器
});
