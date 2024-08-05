const fs = require('fs-extra');
const path = require('path');

const { VERSION_EMPTY, PRODUCT_DESCRIPTIONS } = require('../tools/constatnts');

function fileNsis(buildPath, platform, proc, product) {
  const configTemplate = fs.readFileSync(path.join('lib', 'setup.nsi'));
  const config = `
    !define SERVICE_NAME "${product.label}"
    !define NAME "${product.label}"
    !define PORT "${product.name === 'intraopc' ? 8077 : 8088}"
    !define PUBLISHER "${product.name === 'intraopc' ? 'IntraOPC LLC' : 'Intra LLC'}"
    !define APPFILE "${product.service}"
    !define VERSION "${global.__versions ? global.__versions[product.service] : VERSION_EMPTY}"
    !define DESCRIPTION "${(PRODUCT_DESCRIPTIONS[product.service] || '').replace('\n', '')}"`
    .replace(/    /g, '').trim();

  return config +'\n' + configTemplate;
}



module.exports = fileNsis;