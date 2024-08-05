
const fs = require('fs-extra');
const path = require('path');

function parseExecutableFile(file) {
  const data = fs.readFileSync(file);
  
  // cefaedfe: Mach-O Little Endian (32-bit)
  // cffaedfe: Mach-O Little Endian (64-bit)
  // feedface: Mach-O Big Endian (32-bit)
  // feedfacf: Mach-O Big Endian (64-bit)
  // cafebabe: Universal Binary Big Endian.

  const isELF = data.slice(0, 3).toString('hex') === '7f454c';
  const isMachO = data.slice(0, 4).toString('hex').match(/^(cffaedfe|cefaedfe|feedface|feedfacf|cafebabe)/) !== null; 
  const isPE = data.slice(0, 2).toString('hex') === '4d5a';
  
  if (isELF) {
    const osabi = data[7]; // 0 - UNIX, 3 - GNU/linux
    const machine = data[18]; // 3 - ia32, 40 - arm, 183 - arm64, 62 - x64

    if (osabi === 0 || osabi === 3) {
      if (machine === 3) {
        return { platform: 'linux', arch: 'i386', target: 'linux-i686' };
      }
      if (machine === 40) {
        return { platform: 'linux', arch: 'arm', target: 'linux-armv7' };
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
      return { platform: 'darwin', arch: 'x64', target: 'macos-x64' }; // darwin-x64
    }

    if (cputype === '00000002') {
      return { platform: 'darwin', arch: 'x64', target: 'macos-x64' }; // darwin-x64
    }

    if (cputype === '0c000001') {
      return { platform: 'darwin', arch: 'arm64', target: 'macos-arm64' }; //darwin-arm64
    }
  }

  if (isPE) {
    const signatureIndex = data.toString('hex').indexOf('5045');

    if (signatureIndex !== -1) {
      // 6486 - x64, 4c01 - x32
      const machine = data.slice(signatureIndex / 2 + 4, signatureIndex / 2 + 6).toString('hex');
    
      if (machine === '4c01') {
        return { platform: 'win', arch: 'x32', target: 'win-x64' };
      }
      if (machine === '6486') {
        return { platform: 'win', arch: 'x64', target: 'win-x64' };
      }

      if (machine === 'c201') {
        return { platform: 'win', arch: 'arm', target: 'win-arm' };
      }

      if (machine === '64aa') {
        return { platform: 'win', arch: 'arm64', target: 'win-arm64' };
      }
      
      if (machine === '6462') {
        return { platform: 'win', arch: 'arm64', target: 'win-arm64' };
      }
    }
  }

  return null;
}

function cleanupFile(file, stat, targetPath, platform, proc, product) {
  const ext = path.extname(file);
  const isNodeModules = targetPath.indexOf('node_modules') !== -1;
  
  if (isNodeModules) {
    if (ext === '.node' || ext === '.o' || (ext === '.exe' && platform.name === 'windows')) {
      const info = parseExecutableFile(path.join(targetPath, file));
      if (info && info.target !== proc.target) {
        fs.removeSync(path.join(targetPath, file)); 
      }
    }


    if (ext === '.js' || ext === '.json' || ext === '.node' || ext === '.o' || (ext === '.exe' && platform.name === 'windows') || (ext === '.dll' && platform.name === 'windows') || ext === '.ih' || ext === '.ihpack' || ext === 'woff2') {
   
    } else { 
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
  const isNodeModules = targetPath.indexOf('node_modules') !== -1;
  const folder = path.basename(path.dirname(targetPath));

  if (isNodeModules && (folder === 'docs' || folder === 'test')) {
    fs.removeSync(targetPath); 
  } else {
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
    
    if (fs.readdirSync(targetPath).length === 0) {
      fs.removeSync(targetPath); 
    }
  
  }
}

module.exports = {
  parseExecutableFile,
  cleanupDir,
};