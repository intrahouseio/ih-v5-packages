const fs = require('fs-extra');
const path = require('path');

async function structTools(buildPath, platform, proc, product) {
  if (platform.packer === 'dpkg') {
  
  }

  if (platform.packer === 'nsis') {
    const pathApp = path.join(buildPath, platform.paths.app);
    const pathTools = path.join(buildPath, platform.paths.tools);
    
    fs.ensureDirSync(pathTools);

    fs.copyFileSync(path.join('lib', 'logo.ico'), path.join(pathApp, 'logo.ico'));
    fs.copyFileSync(path.join('lib', 'tools', '7z.exe'), path.join(pathTools, '7z.exe'));
  } 
}

module.exports = structTools;