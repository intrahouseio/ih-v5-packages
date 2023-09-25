const path = require('path');

function filePlist(platform, proc, product) {
  return (`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>LowPriorityIO</key>
  <true/>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>Label</key>
  <string>${product.service}</string>
  <key>WorkingDirectory</key>
  <string>/Library/${product.service}</string>
  <key>ProgramArguments</key>
  <array>
    <string>/Library/${product.service}/${product.service}</string>
  </array>

  <key>StandardOutPath</key>
  <string>/Library/${product.service}/launchdOutput.log</string>

  <key>StandardErrorPath</key>
  <string>/Library/${product.service}/launchdErrors.log</string>
</dict>
</plist>
  `);
}

module.exports = filePlist;