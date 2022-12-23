const fs = require('fs-extra');
const path = require('path');

const filePackage = require('../files/package');
const fileMain = require('../files/main');

async function structPKG(buildPath, platform, proc, product) {
  if (platform.packer === 'dpkg' || platform.packer === 'nsis') {
    const pathPkg = path.join(buildPath, 'pkg');

    fs.ensureDirSync(pathPkg);
    
    fs.ensureDirSync(path.join(pathPkg, 'tools'));
    fs.ensureDirSync(path.join(pathPkg, 'plugins'));

    fs.copySync(path.join('resources', product.name), pathPkg);
    fs.copySync(path.join('resources', 'node_modules'), path.join(pathPkg, 'backend', 'node_modules'));

    const deps = platform.deps[product.name];
  
    for (const resourceType in deps) {
      const resources = deps[resourceType];
  
      for (const resourceId of resources) {
        const pathResource = path.join('resources', resourceId, fs.readdirSync(path.join('resources', resourceId))[0]);
        const resourceFile = fs.readdirSync(pathResource).find(item => item.indexOf('.ih') !== -1);
        const resourceName = fs.readJsonSync(path.join(pathResource, resourceFile)).id;
        
        if (resourceType === 'agents') {
          fs.copySync(pathResource, path.join(pathPkg, resourceName));
        } else {
          fs.copySync(pathResource, path.join(pathPkg, resourceType, resourceName));
        }
      }
    }

    fs.writeFileSync(path.join(pathPkg, 'package.json'), filePackage(platform, proc, product));
    fs.writeFileSync(path.join(pathPkg, 'main.js'), fileMain(platform, proc, product));
  }

  if (platform.packer === 'nsis') {

  } 
}

module.exports = structPKG;