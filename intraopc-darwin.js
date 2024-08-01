const builder = require('./tools/builder');

const options = {
  url_server: 'http://macos.ih-systems.com/versions',
  name: 'darwin',
  packer: 'pkgbuild',
  products: [
    { name: 'intraopc', service: 'intraopc', label: 'IntraOPC', project: 'intraopc.ihpack' },
  ],
  paths: {
    app: '/app',
    assets: '/app',
  },
  processors: [
    { arch: 'x64', target: 'macos-x64' },
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