const { exec } = require('child_process');

const fs = require('fs-extra');
const path = require('path');

const isBeta = process.argv.includes('--beta');
const branch = isBeta ? 'beta' : 'stable';

const fileRelease = require('../files/release');

async function structRepoDeb(repoPath, platform) {
  console.log(' ' + platform.name + ':');
  console.log('   ' + 'create folders...');

  const cwd = path.join(repoPath, platform.name);

  fs.ensureDirSync(path.join(cwd));

  fs.removeSync(path.join(cwd, 'pool', branch));
  fs.removeSync(path.join(cwd, 'dists', branch));

  fs.ensureDirSync(path.join(cwd, 'pool', branch));
  fs.ensureDirSync(path.join(cwd, 'dists', branch, 'main'));

  fs.writeFileSync(path.join(cwd, 'release.conf'), fileRelease(platform), 'utf8');

  console.log('   ' + 'create deb files...');
  for (const file in platform.files) {
    const { product, version, proc } = platform.files[file];

    const dir = path.join(cwd, 'pool', branch, product, version);
    const name = `${product}_${version}_${proc}.deb`;

    const stat = fs.statSync(file);

    fs.ensureDirSync(dir);

    // fs.copySync(file, path.join(dir, name));
    fs.symlinkSync(file, path.join(dir, name), 'file');
    fs.utimesSync(dir, stat.atime, stat.mtime)
    // fs.utimesSync(path.join(dir, name), stat.atime, stat.mtime)
  }

  console.log('   ' + 'create packages/release files...');

  if (platform.processors['amd64']) {
    if (!platform.processors['i386']) {
      platform.processors['i386'] = true;
    }
  }

  if (platform.processors['arm64']) {
    if (!platform.processors['armhf']) {
      platform.processors['armhf'] = true;
    }
  }

  for (const arch in platform.processors) {
    fs.ensureDirSync(path.join(cwd, 'dists', branch, 'main', 'binary-' + arch));
    
    fs.removeSync(path.join(cwd, 'dists', branch, 'main', 'binary-' + arch, 'Packages'));
    fs.removeSync(path.join(cwd, 'dists', branch, 'main', 'binary-' + arch, 'Packages.gz'));
    fs.removeSync(path.join(cwd, 'dists', branch, 'main', 'binary-' + arch, 'Release'));
  
    await cmd_exec(`apt-ftparchive --arch ${arch} packages ${path.join('pool', branch)} > ${path.join(cwd, 'dists', branch, 'main', 'binary-' + arch, 'Packages')}`, cwd);
    await cmd_exec(`gzip -fk ${path.join(cwd, 'dists', branch, 'main', 'binary-' + arch, 'Packages')} > ${path.join(cwd, 'dists', branch, 'main', 'binary-' + arch, 'Packages.gz')}`, cwd);
    await cmd_exec(`apt-ftparchive release ${path.join('dists', branch, 'main', 'binary-' + arch)} > ${path.join(cwd, 'dists', branch, 'main', 'binary-' + arch, 'Release')}`, cwd);
  }

  fs.removeSync(path.join(cwd, 'dists', branch, 'InRelease'));
  fs.removeSync(path.join(cwd, 'dists', branch, 'Release'));
  fs.removeSync(path.join(cwd, 'dists', branch, 'Release.gpg'));

  console.log('   ' + 'create main release file...');

  await cmd_exec(`apt-ftparchive release -c ${path.join('release.conf')} ${path.join('dists', branch)} > ${path.join(cwd, 'dists', branch, 'Release')}`, cwd);
  fs.removeSync(path.join(cwd, 'release.conf'));
  
  console.log('   ' + 'sign gpg/release files...');

  await cmd_exec(`gpg -a --yes --output ${path.join('dists', branch, 'Release.gpg')} --detach-sign ${path.join('dists', branch, 'Release')}`, cwd);  
  await cmd_exec(`gpg -a --yes --clearsign --output ${path.join('dists', branch, 'InRelease')} --detach-sign ${path.join('dists', branch, 'Release')}`, cwd);  
}

function cmd_exec(str, cwd) {
  return new Promise(resolve => { 
    exec(str, { cwd }, err => { 
      if (err) {
        console.log(err);
      }
      resolve();
    })
  });
}

module.exports = structRepoDeb;