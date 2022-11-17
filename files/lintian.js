function fileLintian(platform, proc, product) {
  return (
    'embedded-library\n' +
    'unstripped-binary-or-object\n' +
    'hardening-no-pie\n'
  );
}

module.exports = fileLintian;