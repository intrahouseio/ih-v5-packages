const fs = require('fs-extra');
const path = require('path');

const request = require('request');
const unzipper = require('unzipper');
const tar = require('tar');
const zlib = require('zlib');

const isBeta = process.argv.includes('--beta');

function remoteResource(resource) {
  const headers =  { 'User-Agent': 'Mozilla/5.0' };

  if (fs.existsSync(path.join(process.cwd(), 'github.token'))) {
    headers.Authorization = 'token ' + fs.readFileSync(path.join(process.cwd(), 'github.token'), 'utf8');
    headers.Accept = 'application/vnd.github.v3.raw';
  }

  if (resource.url) {
    return new Promise((resolve, reject) => {
      console.log(resource.type, resource.id, '...');

      request.get({ url: resource.url, headers })
        .pipe(unzipper.Extract({ path: path.join('resources', resource.id ) }))
        .on('finish', () => {
          console.log(resource.type, resource.id, 'ok');
          resolve();
        });   
    });
  }

  return new Promise((resolve, reject) => {
    const url = 'https://api.github.com/repos/intrahouseio/' + (resource.repo || resource.id) + '/releases/' + (resource.tag ? 'tags/' + resource.tag : 'latest');
    console.log(resource.type, resource.id, '...');

    request({ url, headers }, async (err, res, body) => {
      try {
        const json = JSON.parse(body);
        const file = resource.asset ? json.assets.find(i => i.name === resource.asset).id : json.zipball_url;
        const hash = (resource.asset ? json.assets.find(i => i.name === resource.asset).updated_at : json.node_id).replace(/\:/g, '');
   
        if (resource.type === 'product') {
          if (global.__versions === undefined) {
            global.__versions = {};
          }
          global.__versions[resource.id] = json.tag_name.replace('v', '').trim();
        }

        async function end() {
          await fs.writeFile(path.join('resources', resource.id + '_' + hash), '');
    
          console.log(resource.type, resource.id, 'ok');
          
          resolve();
        }

        if (fs.pathExistsSync(path.join('resources', resource.id)) && fs.pathExistsSync(path.join('resources', resource.id + '_' + hash))) {
          console.log(resource.type, resource.id, 'ok');
          resolve();
        } else {   
          await fs.remove(path.join('resources', resource.id));
 
          if (resource.zip === 'tgz') {
            await fs.ensureDir(path.join('resources', resource.id));
            await request.get({ url: file, headers })
              .pipe(zlib.Unzip())
              .pipe(tar.extract({ cwd: path.join(process.cwd(), 'resources', resource.id) })) 
              .on('finish', end);   
          } else {
            if (resource.asset) {
              headers.Accept = 'application/octet-stream';
            }
            await request.get({ url: resource.asset ? ` https://api.github.com/repos/intrahouseio/ih-v5/releases/assets/${file}`: file, headers })
              .pipe(unzipper.Extract({ path: path.join('resources', resource.id ) }))
              .on('finish', end);   
          }
        }
      } catch(e) {
        console.log(e);
        reject(e);
      }
    });
  });
}

function remoteResourceBeta(resource) {
  return new Promise((resolve, reject) => {
    request({ url: `https://update.ih-systems.com/restapi/version?id=${resource.id}_v5` }, async (err, res, body) => {
      try {
        const json = JSON.parse(body);

        console.log(resource.type, resource.file, '...');

        if (global.__versions === undefined) {
          global.__versions = {};
        }

        global.__versions[resource.id] = json.data.payload.beta_version.replace('v', '').trim();

        if (fs.pathExistsSync(path.join('resources', resource.file))) {
          await fs.remove(path.join('resources', resource.file));
        }

        request.get({ url: json.data.payload.beta_url })
          .pipe(unzipper.Extract({ path: path.join('resources', resource.file ) }))
          .on('finish', () => {
            console.log(resource.type, resource.file, 'ok');
            resolve();
          });   
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  });
}

async function dependencies(options) {
  const projects = {};

  const deps = {
    plugins: {},
    agents: {},
    tools: {},
  }

  for (const productId in options.deps) {
    for (const resourceType in options.deps[productId]) {
      const list = options.deps[productId][resourceType];
      
      for (const resourceId of list) {
        deps[resourceType][resourceId] = { 
          id: resourceId, 
          type: resourceType, 
          version: '' 
        };
      }
    }

    if (options.assets) {
      for (const resourceType in options.assets) {
        const list = options.assets[resourceType];
        
        for (const resourceId of list) {
          deps[resourceType][resourceId] = { 
            id: resourceId, 
            type: resourceType, 
            version: '' 
          };
        }
      }
    }
  }

  if (options.products !== undefined) {
    for (const product of options.products) {
      projects[product.project] = true;
    }
  }

  fs.ensureDirSync(path.join('resources'))

  if (isBeta) {
    await remoteResourceBeta({ id: 'intrahouse', type: 'product', file: 'intrahouse_beta' });
    await remoteResourceBeta({ id: 'intrascada', type: 'product', file: 'intrascada_beta' });
  
  } else {
    await remoteResource({ id: 'intrahouse', type: 'product', repo: 'ih-v5', asset: 'intrahouse.zip' });
    await remoteResource({ id: 'intrascada', type: 'product', repo: 'ih-v5', asset: 'intrascada.zip' });
  
  }

  await remoteResource({ id: 'node_modules', type: 'npm', repo: 'ih-v5', tag: 'v0.0.0', asset: 'node_modules_v2.zip' });

  for (const project in projects) {
    await remoteResource({ id: project, type: 'project', url: 'https://raw.githubusercontent.com/intrahouseio/ih-v5/main/projects/' + project });
  }

  for (const resourceType in deps) {
    for (const resourceId in deps[resourceType]) {
      await remoteResource(deps[resourceType][resourceId]);
    }
  }

  return Promise.resolve();
}

module.exports = dependencies;