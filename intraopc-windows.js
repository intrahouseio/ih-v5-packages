const builder = require('./tools/builder');

const options = {
  name: 'windows',
  packer: 'nsis',
  products: [
    { name: 'intraopc', service: 'intraopc', label: 'IntraOPC', project: 'intraopc.ihpack' },

  ],
  paths: {
    app: '/app',
    assets: '/app/assets',
    tools: '/app/tools',
  },
  processors: [
    { arch: 'x64', target: 'win-x64' },
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