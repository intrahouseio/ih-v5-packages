
const fs = require('fs-extra');
const path = require('path');
const spawn = require('child_process').spawn;

const { parseExecutableFile } = require('./cleanup');

async function signFile(file, stat, targetPath, platform, proc, product) {
  const ext = path.extname(file);
  const isNodeModules = targetPath.indexOf('node_modules') !== -1;
  
  if (isNodeModules) {
    if (ext === '.node' || ext === '.o' || (ext === '.exe' && platform.name === 'windows')) {
      const info = parseExecutableFile(path.join(targetPath, file));
      if (info && info.target === proc.target) {
        const cwd = targetPath;
        await cmd('codesign', [
          '--force',
          '--sign', 'Developer ID Application: Vladimir Maltsev (TP2HW42PBJ)',
          path.join(targetPath, file),
        ], cwd);
      }
    }
  }
}

async function signDir(targetPath, platform, proc, product) {
  if (platform.name === 'darwin') {
    for (const file of fs.readdirSync(targetPath)) {
      if (fs.pathExistsSync(path.join(targetPath, file))) {
        const stat = fs.statSync(path.join(targetPath, file));

        if (stat && stat.isDirectory()) { 
          await signDir(path.join(targetPath, file), platform, proc, product);
        } else {
          await signFile(file, stat, targetPath, platform, proc, product);
        }
      }
    }
  }
}

function cmd(command, params, cwd) {
  return new Promise(resolve => {
    const cp = spawn(command, params, { cwd });
  
    cp.stdout.on('data', function(data) {
      console.log(data.toString());
    });
  
    cp.stderr.on('data', function(data) {
      console.log(data.toString());
    });
  
    cp.on('exit', function(code) {
      resolve();
    });
  });
}

module.exports = {
  signDir,
};