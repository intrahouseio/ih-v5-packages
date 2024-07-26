const { VERSION_EMPTY } = require('../tools/constatnts');

function fileCopyright(platform, proc, product) {
  const version = global.__versions ? global.__versions[product.name] : VERSION_EMPTY;
  const v = version.split('.');
  return (`
    1 VERSIONINFO
    FILEVERSION ${v[0]},${v[1]},${v[2]},0
    PRODUCTVERSION ${v[0]},${v[1]},${v[2]},0
    FILEOS 0x40004
    FILETYPE 0x1
    {
    BLOCK "StringFileInfo"
    {
      BLOCK "040904b0"
      {
        VALUE "CompanyName", "${product.name === 'intraopc' ? 'IntraOPC LLC' : 'Intra LLC'}"
        VALUE "ProductName", "${product.label}"
        VALUE "FileDescription", "${product.label}"
        VALUE "FileVersion", "${version}"
        VALUE "ProductVersion", "${version}"
        VALUE "OriginalFilename", "${product.service}.exe"
        VALUE "InternalName", "${product.service}"
        VALUE "LegalCopyright", "Intra License"
      }
    }

    BLOCK "VarFileInfo"
    {
      VALUE "Translation", 0x0409 0x04B0  
    }
    }
  `.replace(/    /g, '').trim());
}

module.exports = fileCopyright;