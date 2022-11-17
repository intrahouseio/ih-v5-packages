const path = require('path');

function filePackage(platform, proc, product) {
  return (
    `
    {
      "pkg": {
        "assets": [
          "backend/locale/**/*",
          "backend/sysbase/**/*",
          "backend/lib/ih-plugin-api/**/*",
          "backend/upgrade/*",
          "frontend/admin/**/*",
          "frontend/user/**/*",
          "sqlite",
          "tools/**/*",
          "plugins/p2p",
          "plugins/webconsole",
          "plugins/pushnotification",
          "plugins/chartmaker",
          "plugins/reportmaker"
        ]
      }
    }
    `.trim()
  );
}

module.exports = filePackage;