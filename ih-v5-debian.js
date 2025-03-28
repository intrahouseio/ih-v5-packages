const builder = require('./tools/builder');

const options = {
  url_server: 'http://deb.ih-systems.com/versions',
  name: 'debian',
  packer: 'dpkg',
  products: [
    { name: 'intrascada', service: 'intrascada', project: 'intrascada.ihpack' },
    { name: 'intrahouse', service: 'intrahouse', project: 'intrahouse.ihpack' },
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
    intrahouse: {
      plugins: [
        'ih-v5-p2p-plugin', 
        'ih-v5-pushnotification-plugin', 'ih-v5-webconsole-plugin', 
        'ih-v5-chartmaker-plugin'
      ],
      agents: ['ih-dbagent-sqlite', 'ih-dbagent-postgresql'],
      tools: ['ih-v5-comports-tool'],
    },
    intrascada: {
      plugins: [
        'ih-v5-p2p-plugin', 
        'ih-v5-pushnotification-plugin', 'ih-v5-webconsole-plugin', 
        'ih-v5-chartmaker-plugin', 'ih-v5-reportmaker-plugin',
      ],
      agents: ['ih-dbagent-sqlite', 'ih-dbagent-postgresql'],
      tools: ['ih-v5-comports-tool'],
    }
  },
  assets: {
    plugins: ['ih-v5-emuls-plugin'],
  },
};

builder(options);