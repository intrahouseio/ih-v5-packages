const fs = require('fs-extra');
const path = require('path');

async function structApp(buildPath, platform, proc, product) {
  if (platform.packer === 'dpkg' || platform.packer === 'nsis' || platform.packer === 'rpmbuild' || platform.packer === 'pkgbuild') {
    const pathApp = platform.packer === 'pkgbuild' ? path.join(buildPath, platform.paths.app, 'Library', product.service) : path.join(buildPath, platform.paths.app);

    const ext = platform.packer === 'nsis' ? '_production.exe' : '';
    const ext2 = platform.packer === 'nsis' ? '.exe' : '';

    fs.ensureDirSync(pathApp);
    
    fs.copyFileSync(path.join(buildPath, 'pkg', product.service + ext), path.join(pathApp, product.service + ext2));
    fs.chmodSync(path.join(pathApp, product.service + ext2), 0755);
    fs.removeSync(path.join(buildPath, 'pkg'));
  }
}

module.exports = structApp;