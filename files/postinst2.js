const fileConfig2 = require('./config2');

function filePostinst2(platform, proc, product) {
  const pathConfig = `/Library/${product.service}`;
  const pathConfigFile = `/Library/${product.service}/config.json`;
  const pathIHSAFile = `/Library/${product.service}/ih_service_active`;
  const config = fileConfig2(platform, proc, product);

  return (
    `#!/bin/bash` + '\n' +
    'set -e' + '\n' +
    'if [ ! -f "' +  pathConfigFile + '" ]; then' + '\n' +
    `  sudo mkdir -p ${pathConfig}` + '\n' +
    `  sudo echo '` + config + `' > "` + pathConfigFile + '"' + '\n' +
    'fi' + '\n' +
    'if [ -f "' +  pathIHSAFile + '" ]; then' + '\n' +
    `  sudo rm ${pathIHSAFile}` + '\n' +
    'else' + '\n' +
    `  sudo launchctl load -w /Library/LaunchDaemons/${product.service}.plist` + '\n' +
    `  sudo launchctl stop ${product.service}` + '\n' +
    `  sudo launchctl start ${product.service}` + '\n' +
    'fi' + '\n'
  );
}

module.exports = filePostinst2;