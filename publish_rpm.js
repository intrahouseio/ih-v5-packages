const fs = require('fs-extra');
const path = require('path');
const semverLt = require('semver/functions/lt');
const { exec } = require('child_process');

const isBeta = process.argv.includes('--beta');
const branch = isBeta ? 'beta' : 'stable';

const { RPM_REPO_DIR, RPM_URL } = require('./tools/constatnts');

const structRepoRpm = require('./structs/repo-rpm');

const platforms = {};
const versions = {};

console.log('Detect files: \n');

async function main() {
  for (const file of fs.readdirSync(isBeta ? path.join('@builds', 'rpm', 'beta') : path.join('@builds', 'rpm', 'stable'))) {
    const ext = path.extname(file);
    const params = [];
    const parse = file.replace(ext, '').split('-');
    
    if (parse.length === 4) {
      params.push(parse.slice(0, -1).join('-'))
      params.push(parse[3].slice(2))
    }
    
    if (ext === '.rpm' && params.length === 2) {
      const [platform, product, version] = params[0].split('-');
      const proc = params[1];

      if (platforms[platform] === undefined) {
        platforms[platform] = { name: platform, products: {}, processors: {}, files: {} };
      }

      platforms[platform].products[product] = true;
      platforms[platform].processors[proc] = true;
      platforms[platform].files[path.join(process.cwd(), isBeta ? path.join('@builds', 'rpm', 'beta') : path.join('@builds', 'rpm', 'stable'), file)] = { platform, product, version, proc, };
  
      console.log(platform, proc, product, version);
    }
  }

  console.log('\nSign:\n');
  await cmd_exec(`docker run --rm -v ${path.join(process.cwd(), isBeta ? path.join('@builds', 'rpm', 'beta') : path.join('@builds', 'rpm', 'stable'))}:/build ih-systems/rpmsign /bin/bash -c 'cd /build && rpm --define "_gpg_name ih-systems.com" --addsign *.rpm'`, process.cwd());  

  console.log('\nPublish:\n');

  for (const name in platforms) {
    await structRepoRpm(path.join(process.cwd(), RPM_REPO_DIR), platforms[name]);
  }


  for (const platform of fs.readdirSync(path.join(RPM_REPO_DIR))) {
    if (fs.statSync(path.join(RPM_REPO_DIR, platform)).isDirectory()) {
      if (fs.existsSync(path.join(RPM_REPO_DIR, platform, branch))) {
        for (const _product of fs.readdirSync(path.join(RPM_REPO_DIR, platform, branch))) {
          if (_product !== 'repodata') {
            for (const _version of fs.readdirSync(path.join(RPM_REPO_DIR, platform, branch, _product))) {
              for (const file of fs.readdirSync(path.join(RPM_REPO_DIR, platform, branch, _product, _version))) {
                const ext = path.extname(file);
                console.log(ext, file)
                const params = [];
                const parse = file.replace(ext, '').split('-');
             
                if (parse.length === 4) {
                  params.push(parse.slice(0, -1).join('-'))
                  params.push(parse[3].slice(2))
                }
                console.log(params)
                const [product, version] = params[0].split('-');
                const proc = params[1];
                console.log(product, version, proc)
                if (versions[product] === undefined) {
                  versions[product] = {};
                }
      
                if (versions[product][platform + '_' + proc] === undefined) {
                  versions[product][platform + '_' + proc] = { version, url: `${RPM_URL}/${platform}/stable/${product}/${version}/${file}` };
                } else {
                  const a = versions[product][platform + '_' + proc].version;
                  const b = version;
                
                  if (semverLt(a, b)) {
                    versions[product][platform + '_' + proc] = { version, url: `${RPM_URL}/${platform}/stable/${product}/${version}/${file}` };
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  if (Object.keys(versions).length) {
    console.log('\nVersions:\n');
    console.log(JSON.stringify(versions, null, 2));

    if (isBeta) {

    } else {
      fs.writeFileSync(path.join(process.cwd(), RPM_REPO_DIR, 'versions'), JSON.stringify(versions, null, 2), 'utf8')
    }
  } else {
    console.log('ERROR: Repository empty!!!');
  }

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
      console.log(data); 
    });
    cp.stderr.on('data', function (data) {
      //console.log(data);
    });
  });
}

main();