const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');

const semverCompare = require('semver/functions/compare')
const semverParse = require('semver/functions/parse')

const isBeta = process.argv.includes('--beta');

async function main () {
  console.log('--- remove deb packages---');

  const debs = { list: {}, map: {} };
  
  for (const file of fs.readdirSync(isBeta ? path.join('@builds', 'deb', 'beta') : path.join('@builds', 'deb', 'stable'))) {
    const ext = path.extname(file);
    const params = file.split('_');
  
    if (ext === '.deb' && params.length === 4) {
      const [platform, product, version] = params;
      const parse = semverParse(version);
  
      if (debs.list[platform + '_' + product] === undefined) {
        debs.list[platform + '_' + product] = [];
      }
      debs.list[platform + '_' + product].push({ platform, product, version, file, parse });
    }
  }
  
  for (const id in debs.list) {
    debs.list[id] = debs.list[id].sort((a, b) => semverCompare(a.version, b.version));
  }
  
  
  for (const id in debs.list) {
    for (const item of debs.list[id]) {
      if (debs.map[id] === undefined) {
        debs.map[id] = { struct: {} };
      }
  
      if (debs.map[id].struct[item.parse.major + '_' + item.parse.minor] === undefined) {
        debs.map[id].struct[item.parse.major + '_' + item.parse.minor] = {};
      }
    
      debs.map[id].struct[item.parse.major + '_' + item.parse.minor][item.version] = isBeta ? path.join('@builds', 'deb', 'beta', item.file) : path.join('@builds', 'deb', 'stable', item.file);
      debs.map[id].lastMinorVersion = item.parse.major + '_' + item.parse.minor;
    }
  }
  
  for (const id in debs.map) {
    for (const minorVersion in debs.map[id].struct) {
      if (debs.map[id].lastMinorVersion !== minorVersion) {
        const items = Object.keys(debs.map[id].struct[minorVersion]).slice(0, -1);
    
        for (const version of items) {
          const file = debs.map[id].struct[minorVersion][version];
          console.log('remove: ' + file);
    
          fs.unlinkSync(file);
        }
      }
    }
  }
  
  console.log('--- end ---\n');
  
  
  console.log('--- remove rpm packages---');
  
  const rpms = { list: {}, map: {} };
  
  for (const file of fs.readdirSync(isBeta ? path.join('@builds', 'rpm', 'beta') : path.join('@builds', 'rpm', 'stable'))) {
    const ext = path.extname(file);
    const params1 = file.replace(ext, '').split('-1.');
    const params2 = params1[0].split('-');
  
    if (ext === '.rpm' && params2.length === 3) {
      const [platform, product, version] = params2;
      const parse = semverParse(version);
      
      if (rpms.list[platform + '_' + product] === undefined) {
        rpms.list[platform + '_' + product] = [];
      }
      rpms.list[platform + '_' + product].push({ platform, product, version, file, parse });
    }
  }
  
  for (const id in rpms.list) {
    rpms.list[id] = rpms.list[id].sort((a, b) => semverCompare(a.version, b.version));
  }
  
  
  for (const id in rpms.list) {
    for (const item of rpms.list[id]) {
      if (rpms.map[id] === undefined) {
        rpms.map[id] = { struct: {} };
      }
  
      if (rpms.map[id].struct[item.parse.major + '_' + item.parse.minor] === undefined) {
        rpms.map[id].struct[item.parse.major + '_' + item.parse.minor] = {};
      }
    
      rpms.map[id].struct[item.parse.major + '_' + item.parse.minor][item.version] = isBeta ? path.join('@builds', 'rpm', 'beta', item.file) : path.join('@builds', 'rpm', 'stable', item.file);
      rpms.map[id].lastMinorVersion = item.parse.major + '_' + item.parse.minor;
    }
  }
  
  for (const id in rpms.map) {
    for (const minorVersion in rpms.map[id].struct) {
      if (rpms.map[id].lastMinorVersion !== minorVersion) {
        const items = Object.keys(rpms.map[id].struct[minorVersion]).slice(0, -1);
    
        for (const version of items) {
          const file = rpms.map[id].struct[minorVersion][version];
          console.log('remove: ' + file);
    
          fs.unlinkSync(file);
        }
      }
    }
  }
  
  console.log('--- end ---\n');
  
  console.log('--- remove windows packages---');
  
  const wins = { list: [], map: {} };
  
  for (const file of fs.readdirSync(path.join('@repositories', 'win', 'intrahouse'))) {
    const ext = path.extname(file);
    const params = file.replace(ext, '').split('-');
    
    if (ext === '.exe' && params.length === 3) {
      const platform = 'windows';
      const product = params[0];
      const version = params[2];
  
      const parse = semverParse(version);
  
      if (wins.list[platform + '_' + product] === undefined) {
        wins.list[platform + '_' + product] = [];
      }
      wins.list[platform + '_' + product].push({ platform, product, version, file, parse });
    }
  }
  
  for (const file of fs.readdirSync(path.join('@repositories', 'win', 'intrascada'))) {
    const ext = path.extname(file);
    const params = file.replace(ext, '').split('-');
    
    if (ext === '.exe' && params.length === 3) {
      const platform = 'windows';
      const product = params[0];
      const version = params[2];
  
      const parse = semverParse(version);
  
      if (wins.list[platform + '_' + product] === undefined) {
        wins.list[platform + '_' + product] = [];
      }
      wins.list[platform + '_' + product].push({ platform, product, version, file, parse });
    }
  }
  
  
  for (const id in wins.list) {
    wins.list[id] = wins.list[id].sort((a, b) => semverCompare(a.version, b.version));
  }
  
  
  for (const id in wins.list) {
    for (const item of wins.list[id]) {
      if (wins.map[id] === undefined) {
        wins.map[id] = { struct: {} };
      }
  
      if (wins.map[id].struct[item.parse.major + '_' + item.parse.minor] === undefined) {
        wins.map[id].struct[item.parse.major + '_' + item.parse.minor] = {};
      }
    
      wins.map[id].struct[item.parse.major + '_' + item.parse.minor][item.version] = path.join('@repositories', 'win', item.product, item.file);
      wins.map[id].lastMinorVersion = item.parse.major + '_' + item.parse.minor;
    }
  }
  
  for (const id in wins.map) {
    for (const minorVersion in wins.map[id].struct) {
      if (wins.map[id].lastMinorVersion !== minorVersion) {
        const items = Object.keys(wins.map[id].struct[minorVersion]).slice(0, -1);
    
        for (const version of items) {
          const file = wins.map[id].struct[minorVersion][version];
          console.log('remove: ' + file);
    
          fs.unlinkSync(file);
        }
      }
    }
  }
  
  console.log('--- end ---\n');
  
  
  console.log('--- remove macos packages---');
  
  const pkgs = { list: [], map: {} };
  
  for (const file of fs.readdirSync(path.join('@repositories', 'macos', 'intrahouse'))) {
    const ext = path.extname(file);
    const params = file.replace(ext, '').split('-');
    
    if (ext === '.pkg' && params.length === 3) {
      const platform = 'macos';
      const product = params[0];
      const version = params[2];
  
      const parse = semverParse(version);
  
      if (pkgs.list[platform + '_' + product] === undefined) {
        pkgs.list[platform + '_' + product] = [];
      }
      pkgs.list[platform + '_' + product].push({ platform, product, version, file, parse });
    }
  }
  
  for (const file of fs.readdirSync(path.join('@repositories', 'macos', 'intrascada'))) {
    const ext = path.extname(file);
    const params = file.replace(ext, '').split('-');
    
    if (ext === '.pkg' && params.length === 3) {
      const platform = 'macos';
      const product = params[0];
      const version = params[2];
  
      const parse = semverParse(version);
  
      if (pkgs.list[platform + '_' + product] === undefined) {
        pkgs.list[platform + '_' + product] = [];
      }
      pkgs.list[platform + '_' + product].push({ platform, product, version, file, parse });
    }
  }
  
  
  for (const id in pkgs.list) {
    pkgs.list[id] = pkgs.list[id].sort((a, b) => semverCompare(a.version, b.version));
  }
  
  
  for (const id in pkgs.list) {
    for (const item of pkgs.list[id]) {
      if (pkgs.map[id] === undefined) {
        pkgs.map[id] = { struct: {} };
      }
  
      if (pkgs.map[id].struct[item.parse.major + '_' + item.parse.minor] === undefined) {
        pkgs.map[id].struct[item.parse.major + '_' + item.parse.minor] = {};
      }
    
      pkgs.map[id].struct[item.parse.major + '_' + item.parse.minor][item.version] = path.join('@repositories', 'macos', item.product, item.file);
      pkgs.map[id].lastMinorVersion = item.parse.major + '_' + item.parse.minor;
    }
  }
  
  for (const id in pkgs.map) {
    for (const minorVersion in pkgs.map[id].struct) {
      if (pkgs.map[id].lastMinorVersion !== minorVersion) {
        const items = Object.keys(pkgs.map[id].struct[minorVersion]).slice(0, -1);
    
        for (const version of items) {
          const file = pkgs.map[id].struct[minorVersion][version];
          console.log('remove: ' + file);
    
          // fs.unlinkSync(file);
        }
      }
    }
  }
  
  console.log('--- end ---\n');
  
  console.log('...clear repo files');
  
  fs.removeSync(path.join('@repositories', 'deb', 'debian', 'dist', 'stable'));
  fs.removeSync(path.join('@repositories', 'deb', 'jethome', 'dist', 'stable'));
  fs.removeSync(path.join('@repositories', 'deb', 'wirenboar', 'dist', 'stable'));
  
  fs.removeSync(path.join('@repositories', 'rpm', 'redhat', 'stable'));
  
  console.log('...publish');
  
  await cmd_exec('sudo node publish_deb', process.cwd());  
  await cmd_exec('sudo node publish_rpm', process.cwd());  

  console.log('\nComplete!');
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
      // console.log(data); 
    });
    cp.stderr.on('data', function (data) {
      //console.log(data);
    });
  });
}

main();