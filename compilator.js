const fs = require('fs-extra');
const path = require('path');
const spawn = require('child_process').spawn;

const { VERSION_EMPTY, TEMP_DIR_NAME } = require('./constatnts');

async function compilator(platform, proc, product) {
  const rootPath = path.join(TEMP_DIR_NAME, platform.name, proc.arch);

  if (platform.packer === 'dpkg') {
    return new Promise((resolve, reject) => {
      cleanup(platform, proc, product);
      
      const cwd = path.join(process.cwd(), rootPath);
      const cp  = spawn('fakeroot', ['dpkg-deb', '--build', './' + product.name], { cwd });

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

function parseExecutableFile(file) {
  const data = fs.readFileSync(file);
 
  const isELF = data.slice(0, 3).toString('hex') === '7f454c';
  const isMachO = data.slice(0, 4).toString('hex') === 'cffaedfe';
  const isPE = data.slice(0, 2).toString('hex') === '4d5a';

  if (isELF) {
    const osabi = data[7]; // 0 - UNIX, 3 - GNU/linux
    const machine = data[18]; // 3 - ia32, 40 - arm, 183 - arm64, 62 - x64

    if (osabi === 0 || osabi === 3) {
      if (machine === 3) {
        return { platform: 'linux', arch: 'i386', target: 'linux-x32' };
      }
      if (machine === 40) {
        return { platform: 'linux', arch: 'arm', target: 'linux-armv7l' };
      }
      if (machine === 183) {
        return { platform: 'linux', arch: 'arm64', target: 'linux-arm64' };
      }
      if (machine === 62) {
        return { platform: 'linux', arch: 'x64', target: 'linux-x64' };
      }
    }
  }

  if (isMachO) {
    // 07000001 - AMD/Intel x86-64, 0c000001 - ARM 64-bit
    const cputype = data.slice(4, 8).toString('hex'); 

    if (cputype === '07000001') {
      return { platform: 'darwin', arch: 'x64', target: 'darwin-x64' };
    }

    if (cputype === '0c000001') {
      return { platform: 'darwin', arch: 'arm64', target: 'darwin-arm64' };
    }
  }

  if (isPE) {
    const signatureIndex = data.toString('hex').indexOf('5045');
    if (signatureIndex !== -1) {
      // 6486 - x64, 041c - x32
      const machine = data.slice(signatureIndex / 2 + 4, signatureIndex / 2 + 6).toString('hex');
      if (machine === '6486') {
        return { platform: 'win', arch: 'x64', target: 'win-x64' };
      }
    }
  }

  return null;
}

function cleanupFile(file, stat, targetPath, platform, proc, product) {
  const ext = path.extname(file);
  const isNodeModules = targetPath.indexOf('node_modules') !== -1;

  if (isNodeModules) {
    if (ext === '.node' || ext === '.o') {
      const info = parseExecutableFile(path.join(targetPath, file));
      
      if (info && info.target !== proc.target) {
        fs.removeSync(path.join(targetPath, file)); 
      }
    }

    if (ext === '.gz' || ext === '.tgz' || ext === '.html' || ext === '.lib') {
      fs.removeSync(path.join(targetPath, file)); 
    }

    try {
      if (parseInt(stat.mode.toString(8), 10) !== 100644) {
        fs.chmodSync(path.join(targetPath, file), 0644);
      }

      if (fs.readFileSync(path.join(targetPath, file), 'utf-8').slice(0, 2) === '#!') {
        fs.removeSync(path.join(targetPath, file)); 
      }
    } catch (e) {

    }
  }
}

function cleanupDir(targetPath, platform, proc, product) {
  for (const file of fs.readdirSync(targetPath)) {
    if (file[0] === '.' || file.slice(-1) === '~') {
      fs.removeSync(path.join(targetPath, file)); 
    } else {
      if (fs.pathExistsSync(path.join(targetPath, file))) {
        const stat = fs.statSync(path.join(targetPath, file));

        if (stat && stat.isDirectory()) { 
          cleanupDir(path.join(targetPath, file), platform, proc, product);
        } else {
          cleanupFile(file, stat, targetPath, platform, proc, product);
        }
      } 
    }
  }
}

function cleanup(platform, proc, product) {
  const buildPath = path.join(TEMP_DIR_NAME, platform.name, proc.arch, product.name);

  cleanupDir(path.join(buildPath, platform.paths.app), platform, proc, product);
  cleanupDir(path.join(buildPath, platform.paths.lib), platform, proc, product);
}

module.exports = compilator;