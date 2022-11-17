const fs = require('fs-extra');
const path = require('path');

const fileControl = require('../files/control');
const filePostinst = require('../files/postinst');
const filePrerm = require('../files/prerm');

async function structPacker(buildPath, platform, proc, product) {
  if (platform.packer === 'dpkg') {
    fs.ensureDirSync(path.join(buildPath, 'DEBIAN'));

    fs.writeFileSync(path.join(buildPath, 'DEBIAN', 'control'), fileControl(buildPath, platform, proc, product));
    fs.writeFileSync(path.join(buildPath, 'DEBIAN', 'postinst'), filePostinst(platform, proc, product), { mode: 0755 });
    fs.writeFileSync(path.join(buildPath, 'DEBIAN', 'prerm'), filePrerm(platform, proc, product), { mode: 0755 });
  }

  if (platform.packer === 'nsis') {

  } 
}

module.exports = structPacker;