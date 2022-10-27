const fs = require('fs-extra');
const path = require('path');

const { TEMP_DIR_NAME } = require('./constatnts');

const structPacker = require('./structs/packer');
const structApp = require('./structs/app');
const structLib = require('./structs/lib');
const structDocs = require('./structs/docs');
const structService = require('./structs/service');

const dependencies = require('./dependencies');
const compilator = require('./compilator');

async function buildProduct(platform, proc, product) {
  console.log('Product:', product.name);

  const buildPath = path.join(TEMP_DIR_NAME, platform.name, proc.arch, product.name);
  
  fs.ensureDirSync(buildPath);

  structPacker(buildPath, platform, proc, product);
  structApp(buildPath, platform, proc, product);
  structLib(buildPath, platform, proc, product);

  structDocs(buildPath, platform, proc, product);
  structService(buildPath, platform, proc, product);
}

async function builder(options) {
  const platform = options;

  console.log('Download Dependencies:');

  await dependencies(options);

  console.log('Platform:', platform.name);

  fs.removeSync(path.join(TEMP_DIR_NAME, platform.name));
  fs.ensureDirSync(path.join(TEMP_DIR_NAME, platform.name));

  for (const proc of platform.processors) {
    console.log('Processor:', proc.arch);

    fs.ensureDirSync(path.join(TEMP_DIR_NAME, platform.name, proc.arch));

    for (const product of platform.products) {
      await buildProduct(platform, proc, product);
      await compilator(platform, proc, product);
    }
  }
}


module.exports = builder;