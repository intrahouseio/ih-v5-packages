const path = require('path');
const fs = require('fs-extra');
const pkg = require('pkg');
const spawn = require('child_process').spawn;

const fileVersion = require('../files/version');

const { cleanupDir } = require('./cleanup');

const { TEMP_DIR_NAME } = require('./constatnts');

async function precompiler(platform, proc, product) {
  const buildPath = path.join(process.cwd(), TEMP_DIR_NAME, platform.name, proc.arch, product.name, 'pkg');
  
  cleanupDir(buildPath, platform, proc, product);

  if (platform.packer === 'dpkg' || platform.packer === 'nsis' || platform.packer === 'rpmbuild') {
    await pkg.exec([
      path.join(buildPath, 'main.js'), 
      '-c', path.join(buildPath, 'package.json'), 
      '-t', 'node18-' + proc.target, 
      '-o', path.join(buildPath, product.name),
    ]);
  }

  if (platform.packer === 'nsis') {
    fs.writeFileSync(path.join(buildPath, 'version.rc'), fileVersion(platform, proc, product));

    await hr(buildPath, `-open version.rc -save version.res -action compile`);
    await hr(buildPath, `-open ${product.service}.exe -save ${product.service}_production.exe -action addoverwrite -resource version.res`);
  }
}

function hr(buildPath, command) {
  return new Promise((resolve, reject) => {
    const cwd = buildPath;
    const cp = spawn(path.join(process.cwd(), 'lib', 'bin', 'rh.exe'), command.split(' '), { cwd });

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

module.exports = precompiler;