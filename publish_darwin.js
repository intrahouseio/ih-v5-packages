const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');
const http = require('http');
const semverLt = require('semver/functions/lt');

const {  MACOS_URL } = require('./tools/constatnts');

const platforms = {};
const versions = {};
const sync = {};
const files = {};

let remoteVersions = {};

const token = fs.readFileSync(path.join(process.cwd(), 'nginx2.token'), 'utf8');

async function main() {
  console.log('Local versions:\n');

  for (const file of fs.readdirSync(`./@builds/pkg/stable`)) {
    const ext = path.extname(file);
    const params = file.replace(ext, '').split('_');
  
    if (ext === '.pkg' && params.length === 4) {
      const [platform, product, version, proc] = params;
  
      if (platforms[platform] === undefined) {
        platforms[platform] = { name: platform, processors: {}, files: {} };
      }

      platforms[platform].processors[proc] = true;
      platforms[platform].files[path.join(process.cwd(), '@builds/pkg/stable', file)] = { platform, product, version, proc, };
  
      console.log(platform, proc, product, version);
    }
  }

  for (const _platform in platforms) {
    const platform = platforms[_platform];
    for (const file in platform.files) {
      const { product, version, proc } = platform.files[file];
      const _file = product + '-' + proc + '-' + version + '.pkg';

      if (sync[product] === undefined) {
        sync[product] = {}
      }

      if (files[product] === undefined) {
        files[product] = {}
      }
      
      sync[product][version] = crypto.createHash('md5').update(fs.readFileSync(file)).digest("hex")
      files[product][version] = { name: _file, file };

      if (versions[product] === undefined) {
        versions[product] = {};
      }

      if (versions[product][_platform + '_' + proc] === undefined) {
        versions[product][_platform + '_' + proc] = { version, url: `${MACOS_URL}/${product}/${_file}` };
      } else {
        const a = versions[product][_platform + '_' + proc].version;
        const b = version;

        if (semverLt(a, b)) {
          versions[product][_platform + '_' + proc] = { version, url: `${MACOS_URL}/${product}/${_file}` };
        }
      }
    }
  }

  console.log('\nGet remote sync:\n');

  remoteVersions = await req('http://macos.ih-systems.com/sync');
  
  console.log(remoteVersions)

  console.log('\nPublish:\n');

  let isUpload = false;

  for (product in sync) {
    for (version in sync[product]) {
      const hash = sync[product][version];

      if (remoteVersions[product] && remoteVersions[product][version] && hash === remoteVersions[product][version]) {

      } else {
        isUpload = true;
        const task = files[product][version];
        console.log(task.name)
        await upload(task.name, product, task.file)
      }
    }
  }

  if (isUpload) {
    console.log('...update sync file')
    await upload('sync', 'sync', sync)
  } else {
    console.log('Everything up-to-date')
  }

  if (Object.keys(versions).length) {
    console.log('\nVersions:\n');
    console.log(JSON.stringify(versions, null, 2));

    await upload('versions', 'versions', versions)
  } else {
    console.log('ERROR: Repository empty!!!');
  }

  console.log('\nComplete!');
}

function upload(name, product, file) {
  return new Promise((resolve, reject) => {
    const postData = typeof file === 'string' ? fs.readFileSync(file) : JSON.stringify(file, null, 2);
    console.log(`/upload/${token}/${product}/${name}`)
    const options = {
      hostname: 'macos.ih-systems.com',
      port: 80,
      path: `/upload/${token}/${product}/${name}`,
      method: 'PUT',
      headers: {
        'Content-Length': postData.length
      }
    };
    
    const req = http.request(options, (res) => {
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
       
      });
      res.on('end', () => {
        if (res.statusCode === 201 || res.statusCode === 204) {
          resolve();
        } else {
          reject(new Error('Request Failed.\n' + `Status Code: ${res.statusCode}`));
        }
      });
    });
    
    req.on('error', (e) => {
      reject(e);
    });
    
    req.write(postData);
    req.end();
  });
}

function req(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      const { statusCode } = res;
      const contentType = res.headers['content-type'];

      let error;

      if (statusCode === 404) {
        resolve({})
      } else {
        if (statusCode !== 200) {
          error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
        } 
        if (error) {
          res.resume();
          reject(error);
        }
      }
    
      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData);
          resolve(parsedData)
        } catch (e) {
          reject(e);
        }
      });
    })
    .on('error', (e) => {
      reject(e);
    });
  })
}


main();