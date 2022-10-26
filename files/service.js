const path = require('path');

function fileService(platform, proc, product) {
  const pathApp = path.join(platform.paths.app, product.service);
  return (
    '[Unit]' + '\n' +
    'Description=' + product.service + '\n' +
    'After=network.target mysql.service' + '\n\n' +
 
    '[Service]' + '\n' +
    'WorkingDirectory=' + pathApp + '\n' +
    'Environment=PATH=' + pathApp + '/node/bin:/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin' + '\n' +
    'Restart=always' + '\n\n' +

    'ExecStart=' + pathApp + '/node/bin/node ' + pathApp + '/backend/app.js prod' + '\n\n' +

    'StandardOutput=journal' + '\n' +
    'StandardError=journal' + '\n' +
    'SyslogIdentifier=' + product.service + '\n\n' +
   
    '[Install]' + '\n' +
    'WantedBy=multi-user.target'
  );
}

module.exports = fileService;