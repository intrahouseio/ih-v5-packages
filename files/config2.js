const path = require('path');

function fileConfig2(platform, proc, product) {
  return JSON.stringify({
    lang: 'ru',
    port: product.name === 'intraopc' ? 8077 : 8088,
    vardir: `/var/lib`,
    assets: `/Library/${product.service}/assets`,
    log: '/var/log',
    temp: `/var/lib`,
  });
}

module.exports = fileConfig2;