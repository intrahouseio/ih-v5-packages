const fs = require('fs-extra');
const path = require('path');
const zlib = require('zlib');

const fileLintian = require('../files/lintian');
const fileCopyright = require('../files/copyright');
const fileChangelog = require('../files/changelog');
const fileHelp = require('../files/help');

async function structDocs(buildPath, platform, proc, product) {
  if (platform.packer === 'dpkg') {
    const pathLintian = path.join(buildPath, 'usr', 'share', 'lintian', 'overrides');
    const pathDocs = path.join(buildPath, 'usr', 'share', 'doc', product.service);
    const pathHelp = path.join(buildPath, 'usr', 'share', 'man', 'man8');

    fs.ensureDirSync(pathLintian);

    fs.writeFileSync(path.join(pathLintian, product.service), fileLintian(platform, proc, product));

    fs.ensureDirSync(pathDocs);
  
    fs.writeFileSync(path.join(pathDocs, 'copyright'), fileCopyright(platform, proc, product));

    const compress = zlib.createGzip({ level: 9 });

    compress.pipe(fs.createWriteStream(path.join(pathDocs, 'changelog.gz')));
    compress.write(fileChangelog(platform, proc, product));
    compress.end();

    fs.ensureDirSync(pathHelp);

    const compress2 = zlib.createGzip({ level: 9 });

    compress2.pipe(fs.createWriteStream(path.join(pathHelp, product.service + '.8.gz')));
    compress2.write(fileHelp(platform, proc, product));
    compress2.end();
  }

  if (platform.packer === 'nsis') {

  } 
}

module.exports = structDocs;