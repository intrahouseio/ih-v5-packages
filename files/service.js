const path = require('path');

function fileService(platform, proc, product) {
  const pathApp = path.join(platform.paths.app);
  const pathWd = path.join(platform.paths.wd, product.service);
  return (
    '[Unit]' + '\n' +
    'Description=' + product.service + '\n' +
    'After=network.target mysql.service' + '\n\n' +
 
    '[Service]' + '\n' +
    'WorkingDirectory=' + pathWd + '\n' +
    'Restart=always' + '\n\n' +

    'ExecStart=' + path.join(pathApp, product.service) + '\n\n' +

    'StandardOutput=journal' + '\n' +
    'StandardError=journal' + '\n' +
    'SyslogIdentifier=' + product.service + '\n\n' +
   
    '[Install]' + '\n' +
    'WantedBy=multi-user.target'
  );
}

module.exports = fileService;