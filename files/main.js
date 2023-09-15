const path = require('path');

function fileMain(platform, proc, product) {
  return (
    // `process.env.ih_temp_dir='${path.join(platform.paths.temp, product.service, 'temp')}';` + '\n' +
    `process.env.ih_pack='${platform.name}_${proc.arch}';` + '\n' +
    `process.env.ih_pack_url='${platform.url_server}';` + '\n' +
    `require('./backend/app');`
  );
}

module.exports = fileMain;