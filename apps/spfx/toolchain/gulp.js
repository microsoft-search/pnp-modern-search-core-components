const fs = require('fs');
const util = require('util');
const path = require('path');
const log = require('fancy-log');

const DefaultRegistry = require('undertaker-registry');

function PnPModernSearchCommonRegistry(this: any, opts: {}) {
  DefaultRegistry.call(this);
  opts = opts || {};
}

util.inherits(PnPModernSearchCommonRegistry, DefaultRegistry);

PnPModernSearchCommonRegistry.prototype.init = (gulpInst: any) => {

  const readJson = (filePath: string, cb: { (err: any, pkgSolution: any): void; (err: any, manifest: any): void; (arg0: any, arg1: any): void; }) => {
    fs.readFile(require.resolve(filePath), (err: any, data: string) => {
      if (err)
        log.error(err);
      else
        cb(null, JSON.parse(data));
    });
  };
  
  const findFilesByExt = (base: string, ext: string | any[], files?: any[], result?: any[]) => {
      files = files || fs.readdirSync(base);
      result = result || [];
  
      files.forEach( 
          (file: string) => {
              var newbase = path.join(base,file);
              if (fs.statSync(newbase).isDirectory()) {
                  result = findFilesByExt(newbase,ext,fs.readdirSync(newbase),result);
              } else {
                  if ( file.substr(-1*(ext.length+1)) == '.' + ext ) {
                      result.push(newbase);
                  } 
              }
          }
      );
      return result;
  };
  
  gulpInst.task('update-version', async () => {

    // List all manifest files
    const manifestFiles = findFilesByExt('./src','manifest.json');
  
    const semver = require('semver');
    const versionArgIdx = process.argv.indexOf('--value');
    const newVersionNumber = semver.valid(process.argv[versionArgIdx+1]);
  
    if (versionArgIdx !== -1 && newVersionNumber) {
        
        // Update version in the package-solution
        const pkgSolutionFilePath = path.resolve('./config/package-solution.json');
        
        readJson(pkgSolutionFilePath, (err: any, pkgSolution: { solution: { version: string; }; }) => {
          log.info('Old package-solution.json version:\t' + pkgSolution.solution.version);
          const pkgVersion = `${semver.major(newVersionNumber)}.${semver.minor(newVersionNumber)}.${semver.patch(newVersionNumber)}.0`;
          pkgSolution.solution.version = pkgVersion;
          log.info('New package-solution.json version:\t' + pkgVersion);
          fs.writeFile(pkgSolutionFilePath, JSON.stringify(pkgSolution, null, 4), (error: any) => {});  
        });
  
        // Updated version in Web Part manifests
        manifestFiles.forEach((manifestFile: any) => {
          readJson(path.resolve(`./${manifestFile}`), (err: any, manifest: { version: string; }) => {
  
            log.info(`Updating manifest file: "./${manifestFile}"`);
  
            log.info('Old manifestFile version:\t' + manifest.version);
            const wpVersion = `${semver.major(newVersionNumber)}.${semver.minor(newVersionNumber)}.${semver.patch(newVersionNumber)}`;
            manifest.version = wpVersion;
            log.info('New manifestFile version:\t' + wpVersion);
            fs.writeFile(manifestFile, JSON.stringify(manifest, null, 4), (error: any) => {});  
          });
        });
    } else {
        log.error(`The provided version ${process.argv[versionArgIdx+1]} is not a valid SemVer version`);
    }
  });
};

module.exports = PnPModernSearchCommonRegistry;