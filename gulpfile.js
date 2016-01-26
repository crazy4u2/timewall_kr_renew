/**
 * Created by Administrator on 2015-05-07.
 */
// Include gulp
var gulp = require('gulp');
var server = require('gulp-express');
var compass = require('gulp-compass');
var autoprefixer = require('gulp-autoprefixer');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var minifycss = require('gulp-minify-css');
var cache = require('gulp-cache');
var deleted = require('gulp-deleted');
var imagemin = require('imagemin');
var path = require('path');
var react = require('gulp-react');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
//var debug = require('gulp-debug');

// renewal
var reactify = require( 'reactify' );
var watchify = require( 'watchify' );
var source = require( 'vinyl-source-stream' );
var browserify = require( 'browserify' );
var del = require( 'del');
var run = require( 'gulp-run' );
var debug = require( 'gulp-debug');
var clean = require( 'gulp-clean' );
var expect = require( 'gulp-expect-file' );

var dev='front-src/dev/';
var release='front-src/release/';

gulp.task('serve',['index','html','jsx','styles','scripts','images'], function() {

    browserSync.init([dev+'html/**/*',dev+'js/*.js',dev+'images/*'],{
        baseDir:'./'
    });

    gulp.watch([dev+'*.html'], ['index']).on('change', browserSync.reload);
    gulp.watch([dev+'html/**/*'], ['html']).on('change', browserSync.reload);
    gulp.watch([dev+'template/jsx/*'], ['jsx']).on('change', browserSync.reload);
    gulp.watch([dev+'js/jsx/*'], ['jsx-merge']).on('change', browserSync.reload);
    gulp.watch([dev+'css/**/*'], ['styles']).on('change', browserSync.reload);
    gulp.watch([dev+'js/**/*'], ['scripts']).on('change', browserSync.reload);
    gulp.watch([dev+'images/**/*'], ['images']).on('change', browserSync.reload);

});

gulp.task('server', function () {
    // Start the server at the beginning of the task
    server.run(['app.js']);
});

// Html
gulp.task('index', function() {
    return gulp.src(dev+'*.html')
        //.pipe(deleted(dev+'html'))
        //.pipe(react())
        .pipe(gulp.dest(release));
});


// Html
gulp.task('html', function() {
    return gulp.src(dev+'html/**/*')
        //.pipe(deleted(dev+'html'))
        //.pipe(react())
        .pipe(gulp.dest(release+'html'));
});

// jsx
gulp.task('jsx', function() {
    return gulp.src(dev+'template/jsx/*')
        //.pipe(debug())
        .pipe(react())
        .pipe(deleted(release+'template/*.jsx'))
        .pipe(gulp.dest(release+'template'));
});

// jsx-merge
gulp.task( 'jsx-merge', function()
{
    gulp.src( 'renewal/js/jsx/**' )
        .pipe( concat( 'ui.js' ) )
        .pipe( react() )
        .pipe( gulp.dest( 'front-src/release/template' ) );
});

// Styles
gulp.task('styles', function() {
    /*
    return gulp.src(dev+'css/*.css')
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest(release+'css'))
        .pipe(browserSync.reload({stream: true}));
    */

    return gulp.src(dev+'css/**/*')
        .pipe(compass({
            sass: dev+'css',
            css: release+'css',
            image: release+'images',
            style:'compact'
        }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        //.pipe(deleted(dev+'css'))
        .pipe(gulp.dest(release+'css'));
});


// Scripts
gulp.task('scripts', function() {
    return gulp.src(dev+'js/**/*')
        //.pipe(uglify({mangle: false}))//syntax error at angular compress, so add option(mangle:false)
        //.pipe(rename({ extname: '.js' }))
        //.pipe(deleted(dev+'js'))
        .pipe(gulp.dest(release+'js'));
});

// Images
gulp.task('images', function() {
    return gulp.src(dev+'images/**/*')
        //.pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        //.pipe(deleted(release+'images'))
        .pipe(gulp.dest(release+'images'));
});

// Watch
gulp.task('watch', function() {

    // Watch .html files
    gulp.watch([dev+'*.html']);
    gulp.watch([dev+'html/**/*']);

    gulp.watch([dev+'template/jsx/*']);

    // Watch .scss files
    gulp.watch(dev+'css/*', ['styles']);

    // Watch .js files
    gulp.watch(dev+'js/*', ['scripts']);

    // Watch image files
    gulp.watch(dev+'images/*', ['images']);

});

gulp.task('default', ['index','html', 'jsx', 'jsx-merge', 'styles','scripts','server','images','serve'], function() {});


////////////////////////////////////////////////////////////////////
// RENEWAL
////////////////////////////////////////////////////////////////////
var libList =
    [
//        'bower_components/requirejs/require.js',
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/jquery/dist/jquery.min.map',
//        'bower_components/underscore/underscore-min.js',
//        'bower_components/backbone/backbone-min.js',
//        'bower_components/Snap.svg/dist/snap.svg-min.js',
        'bower_components/react/react.js',
        'bower_components/react/react-dom.js',
        'front-src/release/js/library/router.js'
    ];

var dist = 'renewal-dist/front-src/renewal/';

// renewal-js
gulp.task( 'renewal-js', function()
{
    return gulp.src( 'renewal/js/*.js')
        .pipe(debug())
        .pipe( gulp.dest( 'renewal-dist/front-src/renewal/js'));
});

gulp.task( 'renewal-js-libs', function()
{
    return gulp.src( libList)// 폴더 구조를 유지할려면 , {base:베이스디렉토리} 인자를 추가한다
        .pipe( expect( libList ) )
        .pipe( gulp.dest( 'renewal-dist/front-src/renewal/js/libs' ));
});

gulp.task( 'renewal-html', function()
{
    return gulp.src( 'renewal/Views/Root/dev.cshtml')
        .pipe( gulp.dest( 'renewal-dist/Views/Root') );
});

gulp.task( 'renewal-watch', function()
{
    gulp.watch(['renewal/jsx/**/*'], ['renewal-jsx']);
});

gulp.task( 'renewal-clean', function( cb )
{
    return gulp.src( 'renewal-dist', {read:false} )
        .pipe( clean() );
});

gulp.task( 'renewal-jsx', function()
{
    gulp.src( 'renewal/js/jsx/**' )
        .pipe( debug() )
        .pipe( react() )
        .pipe( gulp.dest( 'renewal-dist/front-src/renewal/js/templates' ) );
});



gulp.task( 'renewal-sass', function()
{
    return gulp.src('renewal/sass/**/*')
        .pipe(compass({
            sass: 'renewal/sass',
            css: 'renewal-dist/front-src/renewal/css',
            image: 'renewal/images',
            style:'compact'
        }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        //.pipe(deleted(dev+'css'))
        .pipe(gulp.dest('renewal-dist/front-src/renewal/css'));
});

gulp.task( 'renewal-img', function()
{

});

gulp.task( 'renewal',
    [
        //'renewal-clean',
        'renewal-html',
        'renewal-sass',
        'renewal-js',
        'renewal-js-libs',
        'renewal-jsx',
        'renewal-jsx-merge',
        //'renewal-watch',
        'styles'
    ], function(){} );






