const { VERSION_EMPTY, PRODUCT_SITES, PRODUCT_DESCRIPTIONS } = require('../constatnts');

function fileControl(platform, proc, product) {
  return (
    'Package: ' + product.name + '\n' +
    'Version: ' + (global.__versions ? global.__versions[product.name] : VERSION_EMPTY) + '\n' +
    'Section: misc' + '\n' +
    'Priority: optional' + '\n' +
    'Architecture: ' + proc.arch + '\n' +
    'Depends: libatomic1 (>= 4.8), libc6 (>= 2.17), libgcc1 (>= 1:3.5), libstdc++6 (>= 5.2), zip, unzip, rsync' + '\n' +
    'Installed-Size: 280000' + '\n' +
    'Maintainer: ' + 'Intra LLC' + ' <support@ih-systems.com>' + '\n' +
    'Homepage: ' + 'https://' + PRODUCT_SITES[product.name] + '\n' +
    'Description: ' + (PRODUCT_DESCRIPTIONS[product.name] || '') + '\n'
  );
}

module.exports = fileControl;