# gulp-amdcheck [![Build Status](https://travis-ci.org/mehdishojaei/gulp-amdcheck.svg?branch=master)](https://travis-ci.org/mehdishojaei/gulp-amdcheck) [![Known Vulnerabilities](https://snyk.io/test/github/mehdishojaei/gulp-amdcheck/badge.svg)](https://snyk.io/test/github/mehdishojaei/gulp-amdcheck)

> Uses AST to find and remove unused dependencies in AMD modules.

## Getting Started
```shell
npm install gulp-amdcheck --save-dev
```

## The "amdcheck" task

### Overview
When an AMD based project grows, number of it's js files grows too and some dependencies of the modules that had been used before, can become useless later. The AMD module loader (e.g. `requirejs`) loads those useless dependencies from network which can increase initial page load time.
This gulp plugin can detect and remove those useless dependencies without modifying source files.

### Usage

```js
var amdcheck = require('gulp-amdcheck');

gulp.task('amdcheck', function() {
  gulp.src('**/*.js')
    .pipe(amdcheck())
    .pipe(gulp.dest('dist'))
});
```

## example

source.js
```js
define('module1', ['p1', 'p2'], function (a, b) {
  return a;
});

define('module2', ['p1', 'p2', 'p3'], function (a, b, c) {
  return b;
});
```

optimized-source.js
```js
define('module1', ['p1'], function (a) {
  return a;
});

define('module2', ['p2'], function (b) {
  return b;
});
```

### Options

```js
var amdcheck = require('gulp-amdcheck');

gulp.task('amdcheck', function() {
  var options = {
    exceptsPaths: ['bootstrap', /^jquery/i]
  };

  gulp.src('**/*.js')
    .pipe(amdcheck(options))
    .pipe(gulp.dest('dist'));
});
```

#### excepts
Type: Array
Default value: []

An array of strings or RegExps that represent dependency names that should not take into account.

#### exceptsPaths
Type: Array
Default value: []

An array of strings or RegExps that represent dependency paths that should not take into account.

NOTE: `exceptsPaths` can also be declared before each module definition as a comment of strings of module paths separated by commas. This only applies on the underlying module definition.

source.js
```js
/* exceptsPaths: p3 */
define(['p1', 'p2', 'p3'], function (a, b, c) {
  return b;
});
```

optimized-source.js
```js
/* exceptsPaths: p3 */
define(['p2', 'p3'], function (b, c) {
  return b;
});
```

#### logModuleId
Type: boolean
Default value: false

Logs the id of the module if the module id is specified.

#### logDependencyPaths
Type: boolean
Default value: false

Logs the list of dependencies paths of the module.

#### logDependencyNames
Type: boolean
Default value: false

Logs the list of dependencies names of the module.

#### logUnusedDependencyPaths
Type: boolean
Default value: true

Logs the list of unused dependencies paths of the module.

#### logUnusedDependencyNames
Type: boolean
Default value: false

Logs the list of unused dependencies names of the module.

#### logNumberOfModules
Type: boolean
Default value: false

Logs the number of detected modules.

#### removeUnusedDependencies
Type: boolean
Default value: true

Removes detected unused dependencies and save the new files.

#### errorOnUnusedDependencies
Type: boolean
Default value: false

Throws an error if a file contains any unused dependencies.

### Release History
 * 2015-04-27   v1.3.2   Add a new option (logNumberOfModules).
 * 2015-04-26   v1.3.1   Fix a bug in logging.
 * 2015-04-25   v1.3.0   Add a new option (errorOnUnusedDependencies).
 * 2014-08-22   v1.2.5   Fix a bug when there are comments between paths and dependencies.
 * 2014-08-16   v1.2.0   Entirely uses AST.
 * 2014-07-20   v1.0.0   Uses AST to find out unused dependencies.
 * 2014-03-27   v0.0.0   First commit of gulp-amdcheck.
