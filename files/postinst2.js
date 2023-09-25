const fileConfig2 = require('./config2');

function filePostinst2(platform, proc, product) {
  const pathConfig = `/Library/${product.service}`;
  const pathConfigFile = `/Library/${product.service}/config.json`;
  const config = fileConfig2(platform, proc, product);

  return (
    `#!/bin/bash` + '\n' +
    'set -e' + '\n' +
    'if [ ! -f "' +  pathConfigFile + '" ]; then' + '\n' +
    `  sudo mkdir -p ${pathConfig}` + '\n' +
    `  sudo echo '` + config + `' > "` + pathConfigFile + '"' + '\n' +
    'fi' + '\n' +
    'if [ ! -n "$IH_SERVICE_ACTIVE" ]; then' + '\n' +
    `  sudo launchctl load -w /Library/LaunchDaemons/${product.service}.plist` + '\n' +
    `  sudo launchctl stop ${product.service}` + '\n' +
    `  sudo launchctl start ${product.service}` + '\n' +
    'fi'
  );
}

module.exports = filePostinst2;