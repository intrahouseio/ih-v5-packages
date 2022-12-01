function filePrerm(platform, proc, product) {
  return (
    `#!/bin/bash` + '\n' +
    'set -e' + '\n' +
    'if [ "$1" == "remove" ]; then' + '\n' +
    '  deb-systemd-invoke stop ' + product.service + '.service > /dev/null 2>&1' + '\n' +
    '  deb-systemd-invoke disable ' + product.service + '.service > /dev/null 2>&1' + '\n' +
    'fi'
  );
}

module.exports = filePrerm;