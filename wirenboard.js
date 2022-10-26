const builder = require('./builder');

const options = {
  name: 'wirenboard',
  packer: 'dpkg',
  products: [
    { name: 'intrascada', service: 'intrascada', project: 'intrascada_wb.ihpack' },
    { name: 'intrahouse', service: 'intrahouse', project: 'intrahouse.ihpack' },
  ],
  paths: {
    app: '/opt',
    lib: '/var/lib',
  },
  processors: [{ arch: 'armhf', target: 'linux-armv7l' }],
  deps: {
    intrahouse: {
      plugins: [
        'ih-v5-emuls-plugin', 'ih-v5-p2p-plugin', 
        'ih-v5-pushnotification-plugin', 'ih-v5-webconsole-plugin', 
        'ih-v5-chartmaker-plugin', 'ih-v5-mqtt-plugin',
      ],
      agents: ['ih-dbagent-sqlite'],
      tools: ['ih-v5-comports-tool'],
    },
    intrascada: {
      plugins: [
        'ih-v5-emuls-plugin', 'ih-v5-p2p-plugin', 
        'ih-v5-pushnotification-plugin', 'ih-v5-webconsole-plugin', 
        'ih-v5-chartmaker-plugin', 'ih-v5-reportmaker-plugin',
        'ih-v5-mqtt-plugin',
      ],
      agents: ['ih-dbagent-sqlite'],
      tools: ['ih-v5-comports-tool'],
    }
  }
};

builder(options);