const { exec } = require('child_process');

const fs = require('fs-extra');
const path = require('path');

const isBeta = process.argv.includes('--beta');
const branch = isBeta ? 'beta' : 'stable';

async function structRepoRpm(repoPath, platform) {
  console.log(' ' + platform.name + ':');
  console.log('   ' + 'create folders...');

  const cwd = path.join(repoPath, platform.name);

  fs.ensureDirSync(path.join(cwd));

  fs.removeSync(path.join(cwd, branch));

  fs.ensureDirSync(path.join(cwd, branch));

  console.log('   ' + 'create rpm files...');

  for (const file in platform.files) {
    const { product, version, proc } = platform.files[file];
    
    const dir = path.join(cwd, branch, product, version);
    const name = `${product}-${version}-1.${proc}.rpm`;
 
    const stat = fs.statSync(file);

    fs.ensureDirSync(dir);

    fs.symlinkSync(file, path.join(dir, name), 'file');
    fs.utimesSync(dir, stat.atime, stat.mtime)  
  }

  console.log('   ' + 'release files...');
  const dir = path.join(cwd, branch);
  await cmd_exec(`createrepo_c ${dir}`, dir);  
}

function cmd_exec(str, cwd) {
  return new Promise(resolve => { 
    const cp = exec(str, { cwd }, err => { 
      if (err) {
        console.log(err);
      }
      resolve();
    })
    cp.stdout.on('data', function(data) {
      console.log(data.split('\n').map(i => '   ' + i).join('\n')); 
    });
  });
}


module.exports = structRepoRpm;