const fs = require('fs-extra');
const path = require('path');
const zlib = require('zlib');

const fileCopyright = require('../files/copyright');
const fileChangelog = require('../files/changelog');

function structDocs(buildPath, platform, proc, product) {
  if (platform.packer === 'dpkg') {
    const pathDocs = path.join(buildPath, 'usr', 'share', 'doc', product.name);

    fs.ensureDirSync(pathDocs);
  
    fs.writeFileSync(path.join(pathDocs, 'copyright'), fileCopyright(platform, proc, product));

    const compress = zlib.createGzip({ level: 9 });

    compress.pipe(fs.createWriteStream(path.join(pathDocs, 'changelog.gz')));
    compress.write(fileChangelog(platform, proc, product));
    compress.end();
  }

  if (platform.packer === 'nsis') {

  } 
}

module.exports = structDocs;