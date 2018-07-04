var gulp        = require('gulp');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');

// Development Tasks 

gulp.task('browserSync', function() {
 	browserSync({
	    proxy: "localhost:3000",
	    port: 5000,
	    notify: true
 	});
})

gulp.task('watch', function() {
	gulp.watch('assets/css/*.css', browserSync.reload);
	gulp.watch('assets/*.html', browserSync.reload);
	gulp.watch('assets/js/*.js', browserSync.reload);
})

// Build Sequences

gulp.task('default', function(callback) {
	runSequence(
		'browserSync',
		'watch',
		callback
 	)
})