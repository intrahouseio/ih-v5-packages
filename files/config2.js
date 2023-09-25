const path = require('path');

function fileConfig2(platform, proc, product) {
  return JSON.stringify({
    name_service: product.service,
    lang: 'ru',
    port: 8088,
    vardir: `/var/lib`,
    assets: `/Library/${product.service}/assets`,
    log: '/var/log',
    temp: `/var/lib`,
  });
}

module.exports = fileConfig2;