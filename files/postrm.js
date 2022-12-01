const path = require('path');

function filePostrm(platform, proc, product) {
  return (
    `#!/bin/bash` + '\n' +
    'set -e' + '\n' +
    'deb-systemd-invoke stop ' + product.service + '.service > /dev/null 2>&1' + '\n' +
    'deb-systemd-invoke disable ' + product.service + '.service > /dev/null 2>&1' + '\n' +
    'if [ "$1" == "purge" ]; then' + '\n' +
    '  rm -Rf ' + path.join(platform.paths.lib, product.service) + ' > /dev/null 2>&1' + '\n' +
    '  rm -Rf ' + path.join(platform.paths.wd, product.service) + ' > /dev/null 2>&1' + '\n' +
    '  rm -Rf ' + path.join(platform.paths.log, product.service) + ' > /dev/null 2>&1' + '\n' +
    'fi'
  );
}

module.exports = filePostrm;