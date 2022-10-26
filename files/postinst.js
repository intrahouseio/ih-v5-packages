const path = require('path');
const fileConfig = require('./config');

function filePostinst(platform, proc, product) {
  const pathConfig = path.join(platform.paths.app, product.service, 'config.json');
  const config = fileConfig(platform, proc, product);

  return (
    `#!/bin/bash` + '\n' +
    'set -e' + '\n' +
    'if [ ! -f "' +  pathConfig + '" ]; then' + '\n' +
    `  echo '` + config + `' > "` + pathConfig + '"' + '\n' +
    'fi' + '\n\n' +
    'deb-systemd-invoke enable ' + product.service + '.service > /dev/null 2>&1' + '\n' +
    'deb-systemd-invoke restart ' + product.service + '.service > /dev/null 2>&1'
  );
}

module.exports = filePostinst;