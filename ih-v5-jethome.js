const builder = require('./tools/builder');

const options = {
  url_server: 'http://deb.ih-systems.com/versions',
  name: 'jethome',
  packer: 'dpkg',
  products: [
    { name: 'intrascada', service: 'intrascada', project: 'intrascada_jh.ihpack' },
    { name: 'intrahouse', service: 'intrahouse', project: 'intrahouse_jh.ihpack' },
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
    { arch: 'arm64', target: 'linux-arm64' },
  ],
  deps: {
    intrahouse: {
      plugins: [
        'ih-v5-p2p-plugin', 
        'ih-v5-pushnotification-plugin', 'ih-v5-webconsole-plugin', 
        'ih-v5-chartmaker-plugin'
      ],
      agents: ['ih-dbagent-sqlite'],
      tools: ['ih-v5-comports-tool'],
    },
    intrascada: {
      plugins: [
        'ih-v5-p2p-plugin', 
        'ih-v5-pushnotification-plugin', 'ih-v5-webconsole-plugin', 
        'ih-v5-chartmaker-plugin', 'ih-v5-reportmaker-plugin',
      ],
      agents: ['ih-dbagent-sqlite'],
      tools: ['ih-v5-comports-tool'],
    }
  },
  assets: {
    plugins: ['ih-v5-emuls-plugin', 'ih-v5-jethomed1-plugin', 'ih-v5-zigbee-plugin'],
  },
};

builder(options);