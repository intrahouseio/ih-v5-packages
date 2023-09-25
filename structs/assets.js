const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');
const { cleanupDir } = require('../tools/cleanup');

async function structAssets(buildPath, platform, proc, product) {
  if (platform.packer === 'dpkg' || platform.packer === 'nsis' || platform.packer === 'rpmbuild' || platform.packer === 'pkgbuild') {
    let pathAssets = path.join(buildPath, platform.paths.assets, product.service);

    if (platform.packer === 'nsis') {
      pathAssets = path.join(buildPath, platform.paths.assets);
    }

    if (platform.packer === 'pkgbuild') {
      pathAssets = path.join(buildPath, platform.paths.assets, 'Library', product.service, 'assets');
    }

    fs.ensureDirSync(pathAssets);
    
    if (product.project) {
      fs.ensureDirSync(path.join(process.cwd(), pathAssets, 'projects'));

      await zip(path.join(process.cwd(), 'resources', product.project), path.join(process.cwd(), pathAssets, 'projects', 'demo_project' + '.ihpack'));
      // await zip(path.join(process.cwd(), 'resources', product.project), path.join(process.cwd(), pathAssets, 'projects', 'project' + '.ihpack'));
    }

    const assets = platform.assets;
  
    for (const assetType in assets) {
      const resources = assets[assetType];
  
      for (const resourceId of resources) {
        if (!fs.pathExistsSync(path.join(process.cwd(), pathAssets, assetType))) {
          fs.ensureDirSync(path.join(process.cwd(), pathAssets, assetType));
        }
        
        const pathResource = path.join(process.cwd(), 'resources', resourceId, fs.readdirSync(path.join('resources', resourceId))[0]);
        const resourceFile = fs.readdirSync(pathResource).find(item => item.indexOf('.ih') !== -1);
        const resourceName = fs.readJsonSync(path.join(pathResource, resourceFile)).id;

        cleanupDir(pathResource, platform, proc, product);
        
        await zip(pathResource, path.join(process.cwd(), pathAssets, assetType, resourceName + '.ihpack'));
      }
    }
  }
}

function zip(dir, path) {
  return new Promise((resolve) => {
    const output = fs.createWriteStream(path);
    const zip = archiver('zip', { zlib: { level: 9 } });
   
    output.on('close', () => {
      resolve();
    });
   
    zip.pipe(output);
    zip.directory(dir, '');
    zip.finalize();
  });
}

module.exports = structAssets;