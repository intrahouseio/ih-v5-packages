const builder = require('./tools/builder');

const options = {
  url_server: 'http://deb.ih-systems.com/versions',
  name: 'debian',
  packer: 'dpkg',
  products: [
    { name: 'intraopc', service: 'intraopc', project: 'intrascada.ihpack' },
  ],
  paths: {
    app: '/usr/bin',
    lib: '/var/lib',
    assets: '/usr/share',
    wd: '/etc',
    log: '/var/log',
    temp: '/var/lib',
  },
  processors: [
    { arch: 'armhf', target: 'linux-armv7' },
    { arch: 'arm64', target: 'linux-arm64' },
    { arch: 'amd64', target: 'linux-x64' },
  ],
  deps: {
    intraopc: {
      plugins: ['ih-v5-p2p-plugin', 'ih-v5-webconsole-plugin'],
      agents: ['ih-dbagent-sqlite'],
      tools: ['ih-v5-comports-tool'],
    }
  },
  assets: {
    plugins: ['ih-v5-emuls-plugin', 'ih-v5-opcuaserver-plugin', 'ih-v5-modbus-plugin'],
  },
};

builder(options);