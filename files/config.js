const path = require('path');

function fileConfig(platform, proc, product) {
  return JSON.stringify({
    lang: 'ru',
    port: product.name === 'intraopc' ? 8077 : 8088,
    vardir: platform.paths.lib,
    assets: path.join(platform.paths.assets, product.service),
    log: path.join(platform.paths.log, product.service),
    temp: path.join(platform.paths.temp, product.service, 'temp'),
  });
}

module.exports = fileConfig;