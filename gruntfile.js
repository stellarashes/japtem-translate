module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			angular: {
				options: {
					screwIE8: true,
					sourceMap: true
				},
				src: [
					'angular/modules/*.js', 'angular/services/*.js', 'angular/controllers/*.js', 'angular/directives/*.js'
					],
				dest: "js/angular-files.min.js"
			}
		},
		watch: {
			scripts: {
				files: ['angular/*/*.js'],
				tasks:['uglify']
			}
		}
	});
	require('load-grunt-tasks')(grunt);
	grunt.registerTask('default',['uglify']);
	grunt.registerTask('production',['uglify']);
};
