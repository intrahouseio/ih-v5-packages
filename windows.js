const builder = require('./tools/builder');

const options = {
  name: 'windows',
  packer: 'nsis',
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
    { arch: 'x64', target: 'win-x64' },
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
    plugins: ['ih-v5-emuls-plugin'],
  },
};

builder(options);