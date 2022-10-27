const { VERSION_EMPTY } = require('../constatnts');

function fileChangelog(platform, proc, product) {
  return (
    `${product.name} (${global.__versions ? global.__versions[product.name] : VERSION_EMPTY}) stable; urgency=low` + '\n\n' +
    '  * https://github.com/intrahouseio/ih-v5/blob/main/CHANGELOG.md' + '\n\n' +
    ' -- Intra Team <support@ih-systems.com>  ' + new Date().toGMTString().replace(' GMT', ' +0000')
  );
}

module.exports = fileChangelog;