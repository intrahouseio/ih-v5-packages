const path = require('path');
const fileConfig = require('./config');

function filePostinst(platform, proc, product) {
  const pathConfig = path.join(platform.paths.wd, product.service);
  const pathLog = path.join(platform.paths.log, product.service);
  const pathTemp = path.join(platform.paths.temp, product.service);

  const pathConfigFile = path.join(platform.paths.wd, product.service, 'config.json');
  const config = fileConfig(platform, proc, product);

  return (
    `#!/bin/bash` + '\n' +
    'set -e' + '\n' +
    'if [ ! -f "' +  pathConfigFile + '" ]; then' + '\n' +
    `  mkdir -p ${pathConfig}` + '\n' +
    `  echo '` + config + `' > "` + pathConfigFile + '"' + '\n' +
    'fi' + '\n\n' +
    'deb-systemd-invoke stop ' + 'ih-v5' + '.service > /dev/null 2>&1' + '\n' +
    'deb-systemd-invoke disable ' + 'ih-v5' + '.service > /dev/null 2>&1' + '\n' +
    'deb-systemd-invoke enable ' + product.service + '.service > /dev/null 2>&1' + '\n' +
    'deb-systemd-invoke restart ' + product.service + '.service > /dev/null 2>&1'
  );
}

module.exports = filePostinst;