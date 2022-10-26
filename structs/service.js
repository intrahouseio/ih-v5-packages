const fs = require('fs-extra');
const path = require('path');

const fileService = require('../files/service');

function structService(buildPath, platform, proc, product) {
  if (platform.packer === 'dpkg') {
    const pathService = path.join(buildPath, 'lib', 'systemd', 'system');

    fs.ensureDirSync(pathService);
  
    fs.writeFileSync(path.join(pathService, product.service + '.service'), fileService(platform, proc, product));
  }

  if (platform.packer === 'nsis') {

  } 
}

module.exports = structService;