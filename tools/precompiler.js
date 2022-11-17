const path = require('path');
const pkg = require('pkg');

const { cleanupDir } = require('./cleanup');

const { TEMP_DIR_NAME } = require('./constatnts');

async function precompiler(platform, proc, product) {
  const buildPath = path.join(process.cwd(), TEMP_DIR_NAME, platform.name, proc.arch, product.name, 'pkg');
  
  cleanupDir(buildPath, platform, proc, product);

  if (platform.packer === 'dpkg') {
    await pkg.exec([
      path.join(buildPath, 'main.js'), 
      '-c', path.join(buildPath, 'package.json'), 
      '-t', 'node18-' + proc.target, 
      '-o', path.join(buildPath, product.name),
    ]);
  }
}

module.exports = precompiler;