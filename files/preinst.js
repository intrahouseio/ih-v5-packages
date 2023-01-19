const path = require('path');

const { PRODUCT_SITES, PRODUCT_TELEGRAM } = require('../tools/constatnts');

function filePreinst(platform, proc, product) {
  return (`#!/bin/bash
set -e

echo -e "\033[0;33m Вы устанавливаете стороннее программное обеспечение ${product.name}, по всем возникшим вопросам вы можете обратиться в службу поддержки:\n 1. ${(PRODUCT_SITES[product.name] || '')}\n 2. ${(PRODUCT_TELEGRAM[product.name] || '')}\n 3. support@ih-systems.com \033[0m"`);
}

module.exports = filePreinst;

/*
read ask
case "$ask" in
y*|Y*|д*|Д*)
  exit 0
;;
*)
  echo -e "\033[0;31mThe EULA was not accepted. Installation aborted!\033[0m"
  exit 1
;;
esac
*/