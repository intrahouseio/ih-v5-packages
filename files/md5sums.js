const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');

function fileMd5sums(buildPath, platform, proc, product) {
  const files1 = getAllFiles(path.join(buildPath, 'usr'));
  const files2 = getAllFiles(path.join(buildPath, 'lib'));
  const files = [...files1, ...files2];

  const map = [];

  for (const file of files) {
    const hash = crypto.createHash('md5').update(fs.readFileSync(file)).digest('hex');
    map.push(hash + '  ' + file.replace(buildPath + '/', ''));
  }

  return (map.join('\n'));
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

module.exports = fileMd5sums;