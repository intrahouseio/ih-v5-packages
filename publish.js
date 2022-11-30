const fs = require('fs-extra');
const path = require('path');

const { REPO_DIR_NAME, DEB_URL } = require('./tools/constatnts');

const structRepo = require('./structs/repo');

const platforms = {};
const versions = {};

console.log('Detect files: \n');

async function main() {
  for (const file of fs.readdirSync('./build')) {
    const ext = path.extname(file);
    const params = file.replace(ext, '').split('_');
  
    if (ext === '.deb' && params.length === 4) {
      const [platform, product, version, proc] = params;
  
      if (platforms[platform] === undefined) {
        platforms[platform] = { name: platform, processors: {}, files: {} };
      }

      platforms[platform].processors[proc] = true;
      platforms[platform].files[path.join(process.cwd(), 'build', file)] = { platform, product, version, proc, };
  
      console.log(platform, proc, product, version);
    }
  }
  
  console.log('\nPublish:\n');

  for (const name in platforms) {
    await structRepo(path.join(process.cwd(), REPO_DIR_NAME), platforms[name]);
  }

  for (const platform of fs.readdirSync(path.join(REPO_DIR_NAME))) {
    if (fs.statSync(path.join(REPO_DIR_NAME, platform)).isDirectory()) {
      if (fs.existsSync(path.join(REPO_DIR_NAME, platform, 'pool', 'main'))) {
        for (const _product of fs.readdirSync(path.join(REPO_DIR_NAME, platform, 'pool', 'main'))) {
          for (const _version of fs.readdirSync(path.join(REPO_DIR_NAME, platform, 'pool', 'main', _product))) {
            for (const file of fs.readdirSync(path.join(REPO_DIR_NAME, platform, 'pool', 'main', _product, _version))) {
              const ext = path.extname(file);
              const params = file.replace(ext, '').split('_');
              const [product, version, proc] = params;
    
              if (versions[product] === undefined) {
                versions[product] = {};
              }
    
              if (versions[product][platform + '_' + proc] === undefined) {
                versions[product][platform + '_' + proc] = { version, url: `${DEB_URL}/${platform}/pool/main/${file}` };
              } else {
                const a = versions[product][platform + '_' + proc].version.split('.');
                const b = version.split('.');
    
                if (b[0]*100+b[1]*10+b[2] > a[0]*100+a[1]*10+a[2]) {
                  versions[product][platform + '_' + proc] = { version, url: `${DEB_URL}/${platform}/pool/main/${file}` };
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

    fs.writeFileSync(path.join(process.cwd(), REPO_DIR_NAME, 'versions'), JSON.stringify(versions, null, 2), 'utf8')
  } else {
    console.log('ERROR: Repository empty!!!');
  }

  console.log('\nComplete!');
}

main();