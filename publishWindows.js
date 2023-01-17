const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');
const http = require('http');

const platforms = {};
const versions = {};
const files = {};

let remoteVersions = {};

async function main() {
  console.log('Local versions:\n');

  for (const file of fs.readdirSync('./build')) {
    const ext = path.extname(file);
    const params = file.replace(ext, '').split('_');
  
    if (ext === '.exe' && params.length === 4) {
      const [platform, product, version, proc] = params;
  
      if (platforms[platform] === undefined) {
        platforms[platform] = { name: platform, processors: {}, files: {} };
      }

      platforms[platform].processors[proc] = true;
      platforms[platform].files[path.join(process.cwd(), 'build', file)] = { platform, product, version, proc, };
  
      console.log(platform, proc, product, version);
    }
  }

  for (const _platform in platforms) {
    const platform = platforms[_platform];
    for (const file in platform.files) {
      const { product, version, proc } = platform.files[file];

      if (versions[product] === undefined) {
        versions[product] = {}
      }

      if (files[product] === undefined) {
        files[product] = {}
      }
      
      versions[product][version] = crypto.createHash('md5').update(fs.readFileSync(file)).digest("hex")
      files[product][version] = { name: product + '-' + proc + '-' + version + '.exe', file };
    }
  }

  console.log('\nGet remote versions:\n');

  remoteVersions = await req('http://windows.ih-systems.com/versions');
  
  console.log(remoteVersions)

  console.log('\nPublish:\n');

  let isUpload = false;

  for (product in versions) {
    for (version in versions[product]) {
      const hash = versions[product][version];

      if (remoteVersions[product] && remoteVersions[product][version] && hash === remoteVersions[product][version]) {

      } else {
        isUpload = true;
        const task = files[product][version];
        console.log(task.name)
        await upload(task.name, task.file)
      }
    }
  }

  if (isUpload) {
    console.log('...update versions file')
    await upload('versions', versions)
  } else {
    console.log('Everything up-to-date')
  }
}

function upload(name, file) {
  return new Promise((resolve, reject) => {
    const postData = typeof file === 'string' ? fs.readFileSync(file) : JSON.stringify(file, null, 2);

    const options = {
      hostname: 'windows.ih-systems.com',
      port: 80,
      path: '/upload/2122e787-1e8b-4306-9cc7-b60d8d54ce91/' + name,
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