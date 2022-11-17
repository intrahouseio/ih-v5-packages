const fs = require('fs-extra');
const path = require('path');

async function structLib(buildPath, platform, proc, product) {
  if (platform.packer === 'dpkg') {
    // const pathLib = path.join(buildPath, platform.paths.lib, product.service);

    // fs.ensureDirSync(pathLib);
  
    fs.ensureDirSync(path.join(pathLib, 'agents'));
    fs.ensureDirSync(path.join(pathLib, 'base'));
    fs.ensureDirSync(path.join(pathLib, 'node_modules'));
    fs.ensureDirSync(path.join(pathLib, 'plugins'));
    fs.ensureDirSync(path.join(pathLib, 'projects'));
    fs.ensureDirSync(path.join(pathLib, 'tools'));
    fs.ensureDirSync(path.join(pathLib, 'versions'));
  
    const deps = platform.deps[product.name];
  
    for (const resourceType in deps) {
      const resources = deps[resourceType];
  
      for (const resourceId of resources) {
        const pathResource = path.join('resources', resourceId, fs.readdirSync(path.join('resources', resourceId))[0]);
        const resourceFile = fs.readdirSync(pathResource).find(item => item.indexOf('.ih') !== -1);
        const resourceName = fs.readJsonSync(path.join(pathResource, resourceFile)).id;
  
        fs.copySync(pathResource, path.join(pathLib, resourceType, resourceName));
      }
    }
  }

  if (platform.packer === 'nsis') {

  } 
}

module.exports = structLib;