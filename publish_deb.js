const fs = require('fs-extra');
const path = require('path');
const semverLt = require('semver/functions/lt');

const isBeta = process.argv.includes('--beta');
const branch = isBeta ? 'beta' : 'stable';

const { DEB_REPO_DIR, DEB_URL } = require('./tools/constatnts');

const structRepoDeb = require('./structs/repo-deb');

const platforms = {};
const versions = {};

console.log('Detect files: \n');

async function main() {
  for (const file of fs.readdirSync(isBeta ? path.join('@builds', 'deb', 'beta') : path.join('@builds', 'deb', 'stable'))) {
    const ext = path.extname(file);
    const params = file.replace(ext, '').split('_');
  
    if (ext === '.deb' && params.length === 4) {
      const [platform, product, version, proc] = params;
  
      if (platforms[platform] === undefined) {
        platforms[platform] = { name: platform, processors: {}, files: {} };
      }

      platforms[platform].processors[proc] = true;
      platforms[platform].files[path.join(process.cwd(), isBeta ? path.join('@builds', 'deb', 'beta') : path.join('@builds', 'deb', 'stable'), file)] = { platform, product, version, proc, };
  
      console.log(platform, proc, product, version);
    }
  }
  
  console.log('\nPublish:\n');

  for (const name in platforms) {
    await structRepoDeb(path.join(process.cwd(), DEB_REPO_DIR), platforms[name]);
  }

  for (const platform of fs.readdirSync(path.join(DEB_REPO_DIR))) {
    if (fs.statSync(path.join(DEB_REPO_DIR, platform)).isDirectory()) {
      if (fs.existsSync(path.join(DEB_REPO_DIR, platform, 'pool', branch))) {
        for (const _product of fs.readdirSync(path.join(DEB_REPO_DIR, platform, 'pool', branch))) {
          for (const _version of fs.readdirSync(path.join(DEB_REPO_DIR, platform, 'pool', branch, _product))) {
            for (const file of fs.readdirSync(path.join(DEB_REPO_DIR, platform, 'pool', branch, _product, _version))) {
              const ext = path.extname(file);
              const params = file.replace(ext, '').split('_');
              const [product, version, proc] = params;
    
              if (versions[product] === undefined) {
                versions[product] = {};
              }
    
              if (versions[product][platform + '_' + proc] === undefined) {
                versions[product][platform + '_' + proc] = { version, url: `${DEB_URL}/${platform}/pool/stable/${product}/${version}/${file}` };
              } else {
                const a = versions[product][platform + '_' + proc].version;
                const b = version;
    
                if (semverLt(a, b)) {
                  versions[product][platform + '_' + proc] = { version, url: `${DEB_URL}/${platform}/pool/stable/${product}/${version}/${file}` };
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
      fs.writeFileSync(path.join(process.cwd(), DEB_REPO_DIR, 'versions'), JSON.stringify(versions, null, 2), 'utf8')
    }
  } else {
    console.log('ERROR: Repository empty!!!');
  }

  console.log('\nComplete!');
}

main();