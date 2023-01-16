const fs = require('fs-extra');
const path = require('path');
const zlib = require('zlib');

const fileLintian = require('../files/lintian');
const fileCopyright = require('../files/copyright');
const fileLicense = require('../files/license');
const fileChangelog = require('../files/changelog');
const fileHelp = require('../files/help');

async function structDocs(buildPath, platform, proc, product) {
  if (platform.packer === 'dpkg') {
    return new Promise(resolve => {
      let check = 0;

      const pathLintian = path.join(buildPath, 'usr', 'share', 'lintian', 'overrides');
      const pathDocs = path.join(buildPath, 'usr', 'share', 'doc', product.service);
      const pathHelp = path.join(buildPath, 'usr', 'share', 'man', 'man8');
  
      fs.ensureDirSync(pathLintian);
  
      fs.writeFileSync(path.join(pathLintian, product.service), fileLintian(platform, proc, product));
  
      fs.ensureDirSync(pathDocs);
    
      fs.writeFileSync(path.join(pathDocs, 'copyright'), fileCopyright(platform, proc, product));
  
      const compress = zlib.createGzip({ level: 9 });
      const file1 = fs.createWriteStream(path.join(pathDocs, 'changelog.gz'));
  
      compress.pipe(file1);
      compress.write(fileChangelog(platform, proc, product));
      compress.end();
  
      file1.on('finish', () => { 
        check = check + 1;
        if (check === 2) {
          resolve();
        }
      });
  
      fs.ensureDirSync(pathHelp);
  
      const compress2 = zlib.createGzip({ level: 9 });
      const file2 = fs.createWriteStream(path.join(pathHelp, product.service + '.8.gz'));
  
      compress2.pipe(file2);
      compress2.write(fileHelp(platform, proc, product));
      compress2.end();

      file2.on('finish', () => { 
        check = check + 1;
        if (check === 2) {
          resolve();
        }
      });
    })
  }

  if (platform.packer === 'nsis') {
    const pathApp = path.join(buildPath, platform.paths.app);
    
    fs.writeFileSync(path.join(pathApp, 'license.txt'), fileLicense(platform, proc, product));
  } 
}

module.exports = structDocs;