const fs = require('fs-extra');
const path = require('path');

function structApp(buildPath, platform, proc, product) {
  if (platform.packer === 'dpkg') {
    const pathApp = path.join(buildPath, platform.paths.app);

    fs.ensureDirSync(pathApp);
  
    fs.mkdirSync(path.join(pathApp, 'assets'));
    fs.mkdirSync(path.join(pathApp, 'offlinedoc'));
    fs.mkdirSync(path.join(pathApp, 'log'));
    fs.mkdirSync(path.join(pathApp, 'temp'));
      
    fs.copySync(path.join('resources', product.name), pathApp);
    fs.copySync(path.join('resources', 'node_modules'), path.join(pathApp, 'backend'));
  
    fs.copySync(path.join('resources', proc.target, fs.readdirSync(path.join('resources', proc.target))[0]), path.join(pathApp, 'node'));
  
    if (product.project) {
      fs.copySync(path.join('resources', product.project), path.join(pathApp, 'assets', 'demo_project'));
      fs.copySync(path.join('resources', product.project), path.join(pathApp, 'assets', 'project'));
    }
  }

  if (platform.packer === 'nsis') {

  } 
}

module.exports = structApp;