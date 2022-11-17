const fs = require('fs-extra');
const path = require('path');

async function structApp(buildPath, platform, proc, product) {
  if (platform.packer === 'dpkg') {
    const pathApp = path.join(buildPath, platform.paths.app);

    fs.ensureDirSync(pathApp);
    
    fs.copyFileSync(path.join(buildPath, 'pkg', product.service), path.join(pathApp, product.service));
    fs.chmodSync(path.join(pathApp, product.service), 0755);
    fs.removeSync(path.join(buildPath, 'pkg'));
  }

  if (platform.packer === 'nsis') {

  } 
}

module.exports = structApp;