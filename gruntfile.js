module.exports = function(grunt) {
	var sassPath = [
		'components/foundation/scss'
	];
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
				dest: "dist/js/angular-files.min.js"
			}
		},
		watch: {
			sass: {
				files: ['scss/*.scss', 'scss/*/*.scss'],
				tasks: ['sass']
			},
			scripts: {
				files: ['angular/*/*.js'],
				tasks:['uglify']
			}
		},
		sass: {
			dev: {
				options: {
					style: 'expanded',
					sourceMap: true,
					includePaths: sassPath
				},
				files: {
					'dist/css/compiled.css': 'scss/styles.scss'
				}
			}
		}
	});
	require('load-grunt-tasks')(grunt);
	grunt.registerTask('default',['uglify', 'sass']);
	grunt.registerTask('production',['uglify', 'sass']);
};
