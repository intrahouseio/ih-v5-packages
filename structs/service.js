const fs = require('fs-extra');
const path = require('path');

const fileService = require('../files/service');

async function structService(buildPath, platform, proc, product) {
  if (platform.packer === 'dpkg' || platform.packer === 'rpmbuild') {
    const pathService = path.join(buildPath, 'lib', 'systemd', 'system');

    fs.ensureDirSync(pathService);
  
    fs.writeFileSync(path.join(pathService, product.service + '.service'), fileService(platform, proc, product));
  }

  if (platform.packer === 'nsis') {
    const pathService = path.join(buildPath, platform.paths.app, 'daemon');

    fs.ensureDirSync(pathService);

    fs.copyFileSync(path.join('lib', 'daemon', 'daemon.exe'), path.join(pathService, product.service + '.exe'));
    fs.copyFileSync(path.join('lib', 'daemon', 'daemon.exe.config'), path.join(pathService, product.service + '.exe.config'));
  } 
}

module.exports = structService;