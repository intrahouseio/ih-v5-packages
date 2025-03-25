const builder = require('./tools/builder');

const options = {
  url_server: 'http://rpm.ih-systems.com/versions',
  name: 'redhat',
  packer: 'rpmbuild',
  products: [
    { name: 'intraopc', service: 'intraopc', project: 'intraopc.ihpack' },
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
    { arch: 'aarch64', target: 'linux-arm64' },
    { arch: 'x86_64', target: 'linux-x64' },
    { arch: 'armv7hl', target: 'linux-armv7' },
  ],
  deps: {
    intraopc: {
      plugins: ['ih-v5-p2p-plugin', 'ih-v5-webconsole-plugin'],
      agents: ['ih-dbagent-sqlite', 'ih-dbagent-postgresql'],
      tools: ['ih-v5-comports-tool'],
    }
  },
  assets: {
    plugins: ['ih-v5-emuls-plugin', 'ih-v5-opcuaserver-plugin', 'ih-v5-modbus-plugin'],
  },
};

builder(options);