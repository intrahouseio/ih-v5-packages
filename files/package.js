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
          "backend/lib/utils/uputil.js",
          "backend/upgrade/*",
          "frontend/admin/**/*",
          "frontend/user/**/*",
          "sqlite",
          "postgresql",
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