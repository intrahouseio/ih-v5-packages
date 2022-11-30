const { exec } = require('child_process');

const fs = require('fs-extra');
const path = require('path');

const fileRelease = require('../files/release');

async function structRepo(repoPath, platform) {
  console.log(' ' + platform.name + ':');
  console.log('   ' + 'create folders...');

  const cwd = path.join(repoPath, platform.name);

  fs.removeSync(path.join(cwd));

  fs.ensureDirSync(path.join(cwd));
  fs.ensureDirSync(path.join(cwd, 'pool', 'main'));
  fs.ensureDirSync(path.join(cwd, 'dists', 'stable', 'main'));

  fs.writeFileSync(path.join(cwd, 'release.conf'), fileRelease(platform), 'utf8');

  console.log('   ' + 'create deb files...');
  for (const file in platform.files) {
    const { product, version, proc } = platform.files[file];
    const name = `${product}_${version}_${proc}.deb`;
    const stat = fs.statSync(file);

    fs.copySync(file, path.join(cwd, 'pool', 'main', name));
    fs.utimesSync(path.join(cwd, 'pool', 'main', name), stat.atime, stat.mtime)
  }

  console.log('   ' + 'create packages/release files...');

  if (platform.processors['amd64']) {
    if (!platform.processors['i386']) {
      platform.processors['i386'] = true;
    }
  }

  for (const arch in platform.processors) {
    fs.ensureDirSync(path.join(cwd, 'dists', 'stable', 'main', 'binary-' + arch));
    
    fs.removeSync(path.join(cwd, 'dists', 'stable', 'main', 'binary-' + arch, 'Packages'));
    fs.removeSync(path.join(cwd, 'dists', 'stable', 'main', 'binary-' + arch, 'Packages.gz'));
    fs.removeSync(path.join(cwd, 'dists', 'stable', 'main', 'binary-' + arch, 'Release'));
  
    await cmd_exec(`apt-ftparchive --arch ${arch} packages ${path.join('pool', 'main')} > ${path.join(cwd, 'dists', 'stable', 'main', 'binary-' + arch, 'Packages')}`, cwd);
    await cmd_exec(`gzip -fk ${path.join(cwd, 'dists', 'stable', 'main', 'binary-' + arch, 'Packages')} > ${path.join(cwd, 'dists', 'stable', 'main', 'binary-' + arch, 'Packages.gz')}`, cwd);
    await cmd_exec(`apt-ftparchive release ${path.join('dists', 'stable', 'main', 'binary-' + arch)} > ${path.join(cwd, 'dists', 'stable', 'main', 'binary-' + arch, 'Release')}`, cwd);
  }

  fs.removeSync(path.join(cwd, 'dists', 'stable', 'InRelease'));
  fs.removeSync(path.join(cwd, 'dists', 'stable', 'Release'));
  fs.removeSync(path.join(cwd, 'dists', 'stable', 'Release.gpg'));

  console.log('   ' + 'create main release file...');

  await cmd_exec(`apt-ftparchive release -c ${path.join('release.conf')} ${path.join('dists', 'stable')} > ${path.join(cwd, 'dists', 'stable', 'Release')}`, cwd);
  
  console.log('   ' + 'sign gpg/release files...');

  await cmd_exec(`gpg -a --yes --output ${path.join('dists', 'stable', 'Release.gpg')} --detach-sign ${path.join('dists', 'stable', 'Release')}`, cwd);  
  await cmd_exec(`gpg -a --yes --clearsign --output ${path.join('dists', 'stable', 'InRelease')} --detach-sign ${path.join('dists', 'stable', 'Release')}`, cwd);  
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

module.exports = structRepo;