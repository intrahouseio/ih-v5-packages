const { VERSION_EMPTY } = require('../tools/constatnts');

function fileChangelog(platform, proc, product) {
  return (
    `${product.name} (${global.__versions ? global.__versions[product.name] : VERSION_EMPTY}) stable; urgency=low` + '\n\n' +
    `  * https://github.com/intrahouseio/${product.name === 'intraopc' ? 'intraopc' : 'ih-v5'}/blob/main/CHANGELOG.md` + '\n\n' +
    ` -- ${product.name === 'intraopc' ? 'IntraOPC Team' : 'Intra Team'} ${product.name === 'intraopc' ? '<support@intraopc.com>' : '<support@ih-systems.com>'}  ` + new Date().toGMTString().replace(' GMT', ' +0000')
  );
}

module.exports = fileChangelog;