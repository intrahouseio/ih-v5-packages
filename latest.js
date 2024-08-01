const fs = require('fs-extra');
const path = require('path');
const semverLt = require('semver/functions/lt');

const products = ['intrascada', 'intrahouse', 'intraopc'];

const options = [
  { 
    repo: 'deb', 
    dir: 'debian', 
    path: '/pool/stable/',
    ext: 'deb',
    arch: [
      { id: 'amd64', alias: 'x86-64' },
      { id: 'arm64', alias: 'arm64'  },
      { id: 'armhf', alias: 'armv7'  },
    ] 
  },
  { repo: 'deb', dir: 'jethome', path: '/pool/stable/', ext: 'deb', arch: [{ id: 'arm64', alias: 'arm64' }] },
  { repo: 'deb', dir: 'wirenboard', path: '/pool/stable/', ext: 'deb', arch: [{ id: 'armhf', alias: 'armv7' }, { id: 'arm64', alias: 'arm64' }] },
  { 
    repo: 'rpm', 
    dir: 'redhat', 
    path: '/stable/', 
    ext: 'rpm', 
    arch: [
      { id: 'x86_64', alias: 'x86-64' },
      { id: 'aarch64', alias: 'arm64'  },
      { id: 'armv7hl', alias: 'armv7'  },
    ] 
  },
  { repo: 'win', dir: '', path: '', ext: 'exe', arch: [{ id: 'x64', alias: 'x64'  }] },
  { repo: 'macos', dir: '', path: '', ext: 'pkg', arch: [{ id: 'x64', alias: 'x64'  }] },
];

function getLatestVersion(data, ext) {
  if (ext === 'exe' || ext === 'pkg') {
    return data
    .map(i => i.split('x64-')[1].replace('.' + ext, ''))
    .sort((a, b) => (semverLt(a, b) ? 1 : -1))[0];
  }
  return data.sort((a, b) => (semverLt(a, b) ? 1 : -1))[0];
}

console.log('\nLatest:\n');

for (const item of options) {
  fs.removeSync(path.join('@repositories', item.repo, item.dir, 'latest'));
  fs.ensureDirSync(path.join('@repositories', item.repo, item.dir, 'latest'));

  for (const product of products) {
    fs.ensureDirSync(path.join('@repositories', item.repo, item.dir, 'latest', product));

    const folder = path.join('@repositories', item.repo, item.dir, item.path, product);
    const list = fs.readdirSync(folder);
    
    const version = getLatestVersion(list, item.ext);

    for (const arch of item.arch) {
      if (item.ext === 'deb' || item.ext === 'rpm') {
        const prefix1 = item.ext === 'rpm' ? '-' : '_';
        const prefix2 = item.ext === 'rpm' ? '-1.' : '_';
  
        const file1 = `${product}${prefix1}${version}${prefix2}${arch.id}.${item.ext}`;
        const file2 = `${product}_${arch.alias}.${item.ext}`
   
        const src = path.join(process.cwd(),'@repositories', item.repo, item.dir, item.path, product, version, file1);
        const dst = path.join(process.cwd(), '@repositories', item.repo, item.dir, 'latest', product, file2);
        
        if (fs.existsSync(src)) {
          console.log(item.dir.padEnd(10, ' '), file2.padEnd(26, ' '), version);
          fs.symlinkSync(src, dst, 'file');
        }
      }

      if (item.ext === 'exe' || item.ext === 'pkg') {
        const prefix1 = '-';
        const prefix2 = '-';
  
        const file1 = `${product}${prefix1}${arch.id}${prefix2}${version}.${item.ext}`;
        const file2 = `${product}_${arch.alias}.${item.ext}`
   
        const src = path.join(process.cwd(),'@repositories', item.repo, item.dir, item.path, product, file1);
        const dst = path.join(process.cwd(), '@repositories', item.repo, item.dir, 'latest', product, file2);
       
        if (fs.existsSync(src)) {
          console.log(item.repo.padEnd(10, ' '), file2.padEnd(26, ' '), version);
          fs.symlinkSync(src, dst, 'file');
        }
      }
    }
  }
}