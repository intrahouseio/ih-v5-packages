function fileConfig(platform, proc, product) {
  if (platform.name === 'wirenboard') {
    return `{"name_service":"${product.service}","lang":"ru","port":8088,"vardir": "${platform.paths.lib}"}`;
  }
  return `{"name_service":"${product.service}","lang":"ru","port":8088}`;
}

module.exports = fileConfig;