const fs = require('fs-extra');
const path = require('path');

const { VERSION_EMPTY, PRODUCT_SITES, PRODUCT_DESCRIPTIONS } = require('../tools/constatnts');

function fileControl(buildPath, platform, proc, product) {
  return (
    'Package: ' + product.name + '\n' +
    'Version: ' + (global.__versions ? global.__versions[product.name] : VERSION_EMPTY) + '\n' +
    'Section: misc' + '\n' +
    'Priority: optional' + '\n' +
    'Architecture: ' + proc.arch + '\n' +
    'Conflicts:' + (product.name === 'intrascada' ? 'intrahouse' : 'intrascada') + '\n' +
    'Depends: libatomic1 (>= 4.8), libc6 (>= 2.17), libgcc1 (>= 1:3.5), libstdc++6 (>= 5.2), zip, unzip, rsync' + '\n' +
//  'Depends: libc6 (>= 2.17), libgcc1 (>= 1:3.4), libstdc++6 (>= 5.2), zip, unzip, rsync' + '\n' +
    'Installed-Size: ' + getTotalSize(path.join(buildPath)) + '\n' +
    'Maintainer: ' + 'Intra LLC' + ' <support@ih-systems.com>' + '\n' +
    'Homepage: ' + 'https://' + PRODUCT_SITES[product.name] + '\n' +
    'Description: ' + (PRODUCT_DESCRIPTIONS[product.name] || '') + '\n'
  );
}

function getAllFiles(dirPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(file => {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
      arrayOfFiles.push(path.join(dirPath, file))
    }
  })

  return arrayOfFiles
}

function getTotalSize(directoryPath) {
  const arrayOfFiles = getAllFiles(directoryPath)
  let totalSize = 0

  arrayOfFiles.forEach(filePath => {
    totalSize += fs.statSync(filePath).size
  })

  return Math.ceil(totalSize / 1024)
}

module.exports = fileControl;