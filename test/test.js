var should = require('should');
var File = require('gulp-util').File;
var amdcheck = require('..');

describe('gulp-amdcheck', function() {
  describe('in buffer mode', function() {
    it('should optimize module', function(done) {
      var bufferFile = new File({
        contents: new Buffer('define(["p1"], function(a) {})')
      });

      var stream = amdcheck();
      stream.write(bufferFile);

      stream.once('data', function(file) {
        file.isBuffer().should.be.equal(true);
        file.contents.toString().should.be.equal('define([], function() {})');
        done();
      });
    });

    it('should fail on unused dependencies', function(done) {
      var bufferFile = new File({
        contents: new Buffer('define(["p1"], function(a) {})'),
        base: __dirname,
        path: __dirname + '/fixture.js'
      });

      var stream = amdcheck({ errorOnUnusedDependencies: true });

      stream.once('error', function (err) {
        err.message.should.equal('The file "fixture.js" contains the unused dependencies ["a"].');
        done();
      });

      stream.write(bufferFile);
      stream.end();
    });
  });
});
