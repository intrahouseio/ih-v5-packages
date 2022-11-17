const fs = require('fs-extra');
const path = require('path');
const spawn = require('child_process').spawn;

const { cleanupDir } = require('./cleanup');

const { VERSION_EMPTY, TEMP_DIR_NAME } = require('./constatnts');

async function compilator(platform, proc, product) {
  const rootPath = path.join(TEMP_DIR_NAME, platform.name, proc.arch);
  const buildPath = path.join(process.cwd(), TEMP_DIR_NAME, platform.name, proc.arch, product.name);

  if (platform.packer === 'dpkg') {
    return new Promise((resolve, reject) => {
      cleanupDir(path.join(buildPath, platform.paths.assets, product.service), platform, proc, product);

      const cwd = path.join(process.cwd(), rootPath);
      const cp = spawn('fakeroot', ['dpkg-deb', '-Z', 'xz', '--build', './' + product.name], { cwd });

      cp.stdout.on('data', function(data) {
        console.log(data.toString());
      });
    
      cp.stderr.on('data', function(data) {
        console.log(data.toString());
      });
    
      cp.on('exit', function(code) {
        const version = global.__versions ? global.__versions[product.name] : VERSION_EMPTY;
        const src = path.join(process.cwd(), rootPath, product.name + '.deb');
        const dst = path.join(process.cwd(), 'build', `${platform.name}_${product.name}_${version}_${proc.arch}.deb`);
  
        fs.moveSync(src, dst, { overwrite: true });
        resolve();
      });
    });
  }
}

module.exports = compilator;