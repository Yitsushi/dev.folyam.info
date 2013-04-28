var grunt = require('grunt');

grunt.loadNpmTasks('grunt-devtools');

grunt.initConfig({
  pkg: grunt.file.readJSON('package.json'),
  uglify: {
    options: {
      banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */\n'
    },
    build: {
      src: ['src/js/vendors/*.js', 'src/js/*.js', 'src/js/controllers/*.js'],
      dest: 'static/js/<%= pkg.name %>App.min.js'
    }
  },
  copy: {
    main: {
      files: [
        {expand: true, cwd: 'src/templates/', src: ['**'], dest: 'static/templates/'}
      ]
    }
  },
  less: {
    development: {
      options: {
        compress: true
      },
      files: {
        'static/css/app.css': 'src/less/app.less'
      }
    }
  },
});

grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-contrib-less');

grunt.registerTask('default', ['less', 'uglify', 'copy']);
