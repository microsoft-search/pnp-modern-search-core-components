'use strict';
const { registry } = require('gulp');
const build = require('@microsoft/sp-build-web');
build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

const envCheck = build.subTask('environmentCheck', (gulp, config, done) => {

  build.configureWebpack.mergeConfig({
    additionalConfiguration: (generatedConfiguration) => {
  
        generatedConfiguration.module.rules.push(
          {
            test: /\.js$/,
            exclude: (_) => {            
              return /node_modules/.test(_) && !/(@microsoft|@monaco-editor|@pnp\/modern-search-core)/.test(_)
            },
            use: {
              loader: 'babel-loader'
            }
          },
        );
  
        if (!config.production) {
          generatedConfiguration.module.rules.push(
            {
              test: /strings\..+\.d\.ts$/,
              use: 
                {
                  loader: 'null-loader',
                }
              
            },
            {
              test: /\.js$/,
              exclude: (_) => {            
                return /node_modules/.test(_) && !/(@pnp)/.test(_) && /strings\..+\.js$/.test(_);
              },
              enforce: 'pre',
              use: ['source-map-loader'],
            } 
          );
        } else {

          generatedConfiguration.module.rules.push(
            {
              test: /strings\..+(\.d\.ts|\.map)$/,
              use: 
                {
                  loader: 'null-loader',
                }
              
            }
          );
        }
  
        return generatedConfiguration;
  
    }
  });

  done();
});

build.rig.addPreBuildTask(envCheck);


var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  var result = getTasks.call(build.rig);

  result.set('serve', result.get('serve-deprecated'));

  return result;
};

/* fast-serve */
const { addFastServe } = require("spfx-fast-serve-helpers");
addFastServe(build);
/* end of fast-serve */

// SPFx common gulp tasks
//const PnPModernSearchCommonRegistry = require('../toolchain/gulp.js');
//registry(new PnPModernSearchCommonRegistry());

build.initialize(require('gulp'));

