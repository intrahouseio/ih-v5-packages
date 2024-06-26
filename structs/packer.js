const fs = require('fs-extra');
const path = require('path');

const fileMd5sums = require('../files/md5sums');
const fileControl = require('../files/control');
const filePostinst = require('../files/postinst');
const filePostinst2 = require('../files/postinst2');
const filePreinst  = require('../files/preinst');
const filePostrm = require('../files/postrm');
const filePrerm = require('../files/prerm');

const fileSetupNSI = require('../files/setupNSI');
const fileSpec = require('../files/spec');
const filePlist2 = require('../files/plist2');
const fileDistribution = require('../files/distribution');

async function structPacker(buildPath, platform, proc, product) {
  if (platform.packer === 'dpkg') {
    fs.ensureDirSync(path.join(buildPath, 'DEBIAN'));

    fs.writeFileSync(path.join(buildPath, 'DEBIAN', 'control'), fileControl(buildPath, platform, proc, product));
    fs.writeFileSync(path.join(buildPath, 'DEBIAN', 'postinst'), filePostinst(platform, proc, product), { mode: 0755 });
    fs.writeFileSync(path.join(buildPath, 'DEBIAN', 'postrm'), filePostrm(platform, proc, product), { mode: 0755 });
    fs.writeFileSync(path.join(buildPath, 'DEBIAN', 'prerm'), filePrerm(platform, proc, product), { mode: 0755 });

    if (platform.name === 'jethome') {
      fs.writeFileSync(path.join(buildPath, 'DEBIAN', 'preinst'), filePreinst(platform, proc, product), { mode: 0755 });
    }
   
    fs.writeFileSync(path.join(buildPath, 'DEBIAN', 'md5sums'), fileMd5sums(buildPath, platform, proc, product));
  }

  if (platform.packer === 'rpmbuild') {
    fs.writeFileSync(path.join(buildPath, 'setup.spec'), fileSpec(buildPath, platform, proc, product));
  }

  if (platform.packer === 'nsis') {
    fs.writeFileSync(path.join(buildPath, 'setup.nsi'), fileSetupNSI(buildPath, platform, proc, product));
  } 

  if (platform.packer === 'pkgbuild') {
    const pathApp = path.join(buildPath, platform.paths.app);
    
    fs.ensureDirSync(path.join(buildPath, 'scripts'));
    fs.ensureDirSync(path.join(buildPath, 'temp'));

    fs.writeFileSync(path.join(pathApp, 'Library', product.service, product.service + '.plist'), filePlist2(platform, proc, product));
    fs.writeFileSync(path.join(buildPath, 'scripts', 'postinstall'), filePostinst2(platform, proc, product), { mode: 0755 });
    fs.writeFileSync(path.join(buildPath, 'distribution'), fileDistribution(buildPath, platform, proc, product));
  } 
}

module.exports = structPacker;