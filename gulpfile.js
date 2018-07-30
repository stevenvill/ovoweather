var gulp        = require('gulp');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');
var concat      = require('gulp-concat');
var uglify      = require('gulp-uglify');
var cssnano     = require('gulp-cssnano');
var imagemin    = require('gulp-imagemin');
var htmlmin     = require('gulp-htmlmin');
var cache       = require('gulp-cache');
var del         = require('del');

// Development Tasks 

gulp.task('browserSync', function() {
 	browserSync({
	    proxy: "localhost:3000",
	    port: 3001,
	    notify: true
 	});
})

gulp.task('watch', function() {
	gulp.watch('assets/css/*.css', browserSync.reload);
	gulp.watch('assets/*.html', browserSync.reload);
	gulp.watch('assets/js/*.js', browserSync.reload);
})

// Optimization Tasks

gulp.task('pack-js', function() {	
	return gulp.src('assets/js/*.js')
		.pipe(concat('main.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'));
});

gulp.task('pack-css', function() {	
	return gulp.src('assets/css/*.css')
		.pipe(cssnano())
		.pipe(gulp.dest('dist/css'));
});

gulp.task('images', function() {
	return gulp.src('assets/img/*.+(png|jpg|gif|svg)')
		.pipe(cache(imagemin()))
		.pipe(gulp.dest('dist/img'))
});

gulp.task('pages', function() {
	return gulp.src(['assets/*.html'])
		.pipe(htmlmin({
			collapseWhitespace: true,
			removeComments: true
		}))
		.pipe(gulp.dest('dist'));
});

gulp.task('clean:dist', function() {
	return del.sync('dist');
})

// Build Sequences

gulp.task('default', function(callback) {
	runSequence(
		'browserSync',
		'watch',
		callback
 	)
})

gulp.task('build', function(callback) {
	runSequence(
		'clean:dist',
		['pack-js', 'pack-css', 'images', 'pages'],
		callback
	)
})