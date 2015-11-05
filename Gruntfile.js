/***
 * Excerpted from "Automate with Grunt",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material, 
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose. 
 * Visit http://www.pragmaticprogrammer.com/titles/bhgrunt for more book information.
***/
module.exports = function(grunt){

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.config('copy', {
    main: {
        files: [
          {expand: true, cwd:'bower_components/jquery/dist/', src: ['**'], dest: 'lib/jquery'},
          {expand: true, cwd:'bower_components/angular/', src: ['**'], dest: 'lib/angular'},
          {expand: true, cwd:'bower_components/bootstrap-css/', src: ['**'], dest: 'lib/bootstrap-css'}
        ]
      }
  });

  grunt.registerTask('build', "Builds the application.",
                    ['copy'
                     ]);

};