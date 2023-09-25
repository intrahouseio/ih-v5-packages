const fs = require('fs-extra');
const path = require('path');
const spawn = require('child_process').spawn;

const { cleanupDir } = require('./cleanup');

const { VERSION_EMPTY, TEMP_DIR_NAME } = require('./constatnts');

const isBeta = process.argv.includes('--beta');

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
        const dst = path.join(process.cwd(), (isBeta ? path.join('@builds', 'deb', 'beta') : path.join('@builds', 'deb', 'stable')), `${platform.name}_${product.name}_${version}_${proc.arch}.deb`);
  
        fs.moveSync(src, dst, { overwrite: true });
        resolve();
      });
    });
  }

  if (platform.packer === 'rpmbuild') {
    return new Promise((resolve, reject) => {
      cleanupDir(path.join(buildPath, platform.paths.assets, product.service), platform, proc, product);
 
      const cwd = buildPath;
      const cp = spawn('rpmbuild', ['--target', proc.arch, '--buildroot', buildPath + '/', '-bb', 'setup.spec'], { cwd });

      cp.stdout.on('data', function(data) {
        console.log(data.toString());
      });
    
      cp.stderr.on('data', function(data) {
        console.log(data.toString());
      });
    
      cp.on('exit', function(code) {
        const version = (global.__versions ? global.__versions[product.name] : VERSION_EMPTY).replace('-beta', 'b');
        const src = path.join(process.cwd(), rootPath, product.name + '.rpm');
        const dst = path.join(process.cwd(), (isBeta ? path.join('@builds', 'rpm', 'beta') : path.join('@builds', 'rpm', 'stable')), `${platform.name}-${product.name}-${version}-1.${proc.arch}.rpm`);

        fs.moveSync(src, dst, { overwrite: true });
        resolve();
      });
    });
  }

  if (platform.packer === 'nsis') {
    return new Promise((resolve, reject) => {
      const cwd = buildPath;
      const cp = spawn('C:\\Program Files (x86)\\NSIS\\makensis.exe', ['setup.nsi'], { cwd });

      cp.stdout.on('data', function(data) {
        console.log(data.toString());
      });
    
      cp.stderr.on('data', function(data) {
        console.log(data.toString());
      });
    
      cp.on('exit', function(code) {
        const version = global.__versions ? global.__versions[product.name] : VERSION_EMPTY;
        const src = path.join(buildPath, 'setup' + '.exe');
        const dst = path.join(process.cwd(), 'build', `${platform.name}_${product.name}_${version}_${proc.arch}.exe`);
  
        fs.moveSync(src, dst, { overwrite: true });
        resolve();
      });
    });
  }

  if (platform.packer === 'pkgbuild') {
    return new Promise((resolve, reject) => {
      const cwd = buildPath;
      const version = global.__versions ? global.__versions[product.name] : VERSION_EMPTY;

      const cp = spawn('pkgbuild', [
        '--identifier', `"ru.${product.name}.client"`,
        '--version', `"${version}"`,
        '--scripts', './scripts', 
        '--root', './app',
        `./temp/${product.name}.pkg`,
      ], { cwd });

      cp.stdout.on('data', function(data) {
        console.log(data.toString());
      });
    
      cp.stderr.on('data', function(data) {
        console.log(data.toString());
      });
    
      cp.on('exit', function(code) {
        const cp2 = spawn('productbuild', [
          '--distribution', './distribution',
          '--resources', './resources', 
          '--package-path', './temp', 
          `./${product.name}.pkg`,
        ], { cwd });
  
        cp2.stdout.on('data', function(data) {
          console.log(data.toString());
        });
      
        cp2.stderr.on('data', function(data) {
          console.log(data.toString());
        });
      
        cp2.on('exit', function(code) {
          const cp3 = spawn('productsign', [
            '--sign', 'Developer ID Installer: Vladimir Maltsev (TP2HW42PBJ)',
            `./${product.name}.pkg`,
            `./${product.name}_sign.pkg`,
          ], { cwd });
    
          cp3.stdout.on('data', function(data) {
            console.log(data.toString());
          });
        
          cp3.stderr.on('data', function(data) {
            console.log(data.toString());
          });
        
          cp3.on('exit', function(code) {
            const src = path.join(buildPath, product.name + '_sign.pkg');
            const dst = path.join(process.cwd(), (isBeta ? path.join('@builds', 'pkg', 'beta') : path.join('@builds', 'pkg', 'stable')), `${platform.name}_${product.name}_${version}_${proc.arch}.pkg`);
         
            fs.moveSync(src, dst, { overwrite: true });
            resolve();
          });
        });
      });
    });
  }
}

module.exports = compilator;