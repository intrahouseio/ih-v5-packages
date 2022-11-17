const { PRODUCT_DESCRIPTIONS } = require('../tools/constatnts');

function fileHelp(platform, proc, product) {
  return (
    `.TH ${product.name} 8 "${new Date().toISOString().slice(0,10)}" "" ""` + '\n' +
    '.SH NAME' + '\n' +
    `${product.name} - ${PRODUCT_DESCRIPTIONS[product.name].replace('\n', '')}` + '\n' +
    '.SH SYNOPSIS' + '\n' +
    `.B ${product.name}` + '\n' +
    '.RB [ --cwd ]'
  );
}

module.exports = fileHelp;
