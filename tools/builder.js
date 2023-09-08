const fs = require('fs-extra');
const path = require('path');

const { TEMP_DIR_NAME } = require('./constatnts');

const structPacker = require('../structs/packer');
const structPkg = require('../structs/pkg');
const structApp = require('../structs/app');
const structAssets = require('../structs/assets');
const structLib = require('../structs/lib');
const structDocs = require('../structs/docs');
const structService = require('../structs/service');
const structTools = require('../structs/tools');

const dependencies = require('./dependencies');
const precompiler = require('./precompiler');
const compilator = require('./compilator');

async function preparation(platform, proc, product) {
  const buildPath = path.join(TEMP_DIR_NAME, platform.name, proc.arch, product.name);
  
  fs.ensureDirSync(buildPath);

  structPkg(buildPath, platform, proc, product);
}

async function production(platform, proc, product) {
  const buildPath = path.join(TEMP_DIR_NAME, platform.name, proc.arch, product.name);
  
  fs.ensureDirSync(buildPath);

  await structApp(buildPath, platform, proc, product);
  await structAssets(buildPath, platform, proc, product);
  /// structLib(buildPath, platform, proc, product);
  await structDocs(buildPath, platform, proc, product);
  await structService(buildPath, platform, proc, product);
  await structTools(buildPath, platform, proc, product);

  await structPacker(buildPath, platform, proc, product);
}

async function builder(options) {
  const platform = options;

  console.log('Download Dependencies:');

  //### await dependencies(options);

  console.log('Platform:', platform.name);

  fs.removeSync(path.join(TEMP_DIR_NAME, platform.name));
  fs.ensureDirSync(path.join(TEMP_DIR_NAME, platform.name));

  for (const proc of platform.processors) {
    console.log('Processor:', proc.arch);

    fs.ensureDirSync(path.join(TEMP_DIR_NAME, platform.name, proc.arch));

    for (const product of platform.products) {
      console.log('Product:', product.name);

      await preparation(platform, proc, product);
      await precompiler(platform, proc, product);
    
      await production(platform, proc, product);
      await compilator(platform, proc, product);
    }
  }
}

module.exports = builder;