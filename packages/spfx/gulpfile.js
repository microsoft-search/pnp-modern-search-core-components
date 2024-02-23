/* eslint-disable @typescript-eslint/no-empty-function */
'use strict';

const gulp = require('gulp')
const path = require('path');
const fs = require("fs");
const log = require('fancy-log');
const replace = require("gulp-replace");
const { src, dest } = require("gulp");
const rename = require("gulp-rename");
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
          {
            test: /\.js$/,
            // only run on lit packages in the root node_module folder
            include: /node_modules\/(\@lit)|(lit)/,
            exclude: [
              {
                // Exclude this rule from everything.
                test: __dirname,
                // Add back the ES2021 Lit dependencies. Add anything else here that uses modern
                // JavaScript that Webpack 4 doesn't understand.
                exclude: ['@lit', 'lit-element', 'lit-html'].map((p) =>
                  path.resolve(__dirname, 'node_modules/' + p)
                ),
              },
            ],
            use: {
              loader: 'babel-loader',
              options: {
                plugins: [
                  "@babel/plugin-transform-optional-chaining",
                  "@babel/plugin-transform-nullish-coalescing-operator",
                  "@babel/plugin-transform-logical-assignment-operators"
                ]
              }
            }
          }
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

const readJson = (path, cb) => {
  fs.readFile(require.resolve(path), (err, data) => {
      if (err)
          log.error(err)
      else
          cb(null, JSON.parse(data))
  });
}

const findFilesByExt = (base, ext, files, result) => {
  files = files || fs.readdirSync(base)
  result = result || []

  files.forEach(
      function (file) {
          var newbase = path.join(base, file)
          if (fs.statSync(newbase).isDirectory()) {
              result = findFilesByExt(newbase, ext, fs.readdirSync(newbase), result)
          } else {
              if (file.substr(-1 * (ext.length + 1)) == '.' + ext) {
                  result.push(newbase)
              }
          }
      }
  );
  return result
}

gulp.task('update-version', async () => {

  // List all manifest files
  const manifestFiles = findFilesByExt('./src','manifest.json');
  
  const semver = require('semver');
  const versionArgIdx = process.argv.indexOf('--value');
  const newVersionNumber = semver.valid(process.argv[versionArgIdx+1]);

  if (versionArgIdx !== -1 && newVersionNumber) {
      
      // Update version in the package-solution
      const pkgSolutionFilePath = path.resolve('./config/package-solution.json');
      
      readJson(pkgSolutionFilePath, (err, pkgSolution) => {
        log.info('Old package-solution.json version:\t' + pkgSolution.solution.version);
        const pkgVersion = `${semver.major(newVersionNumber)}.${semver.minor(newVersionNumber)}.${semver.patch(newVersionNumber)}.0`;
        pkgSolution.solution.version = pkgVersion;
        log.info('New package-solution.json version:\t' + pkgVersion);
        fs.writeFileSync(pkgSolutionFilePath, JSON.stringify(pkgSolution, null, 4), (error) => {});  
      });

      // Updated version in Web Part manifests
      manifestFiles.forEach((manifestFile) => {
        readJson(path.resolve(`./${manifestFile}`), (err, manifest) => {

          log.info(`Updating manifest file: "./${manifestFile}"`);

          log.info('Old manifestFile version:\t' + manifest.version);
          const wpVersion = `${semver.major(newVersionNumber)}.${semver.minor(newVersionNumber)}.${semver.patch(newVersionNumber)}`;
          manifest.version = wpVersion;
          log.info('New manifestFile version:\t' + wpVersion);
          fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 4), (error) => { });  
        });
      });
  } else {
      log.error(`The provided version ${process.argv[versionArgIdx+1]} is not a valid SemVer version`);
  }

});

gulp.task('update-package-name', async () => {

  const pkgSolutionFilePath = './config/package-solution.json';

  const fileNameArg = process.argv.indexOf('--name');
  const fileName = process.argv[fileNameArg + 1];

  if (fileNameArg !== -1 && fileName) {
      readJson(pkgSolutionFilePath, (err, pkgSolution) => {
          const currentPackageName = path.basename(pkgSolution.paths.zippedPackage, '.sppkg');
          log.info(`Rename ${currentPackageName}.sppkg to ${fileName}.sppkg`);
          pkgSolution.paths.zippedPackage = pkgSolution.paths.zippedPackage.replace(path.basename(pkgSolution.paths.zippedPackage, '.sppkg'), fileName);
          fs.writeFile(pkgSolutionFilePath, JSON.stringify(pkgSolution, null, 4), (error) => { });
      });
  } else {
      log.error(`Error: wrong parameters`);
  }
});

// Local project tasks
gulp.task('update-docs-url', async () => {

  const hostUrlArg = process.argv.indexOf("--hosturl");
  const hostUrl = process.argv[hostUrlArg+1];

  return src("src/webparts/**/*.template.json")
      .pipe(replace("{{DOCUMENTATION_HOST_URL}}", hostUrl))
      .pipe(rename((path) => {

          return {
              dirname: "src/webparts/" + path.dirname,
              basename: path.basename.replace(".template",""),
              extname: ".json"
          };
      }))
      .pipe(dest("./"))
});

build.initialize(require('gulp'));

