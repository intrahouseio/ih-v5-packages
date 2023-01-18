const path = require('path');

function filePreinst(platform, proc, product) {
  return (`#!/bin/bash
set -e

echo -e "\033[0;33m ${product.name} - third party software, \n for all questions please contact support@ih-systems.com. I agree [y/n]?\033[0m"

read ask
case "$ask" in
y*|Y*|д*|Д*)
  exit 0
;;
*)
  echo -e "\033[0;31mThe EULA was not accepted. Installation aborted!\033[0m"
  exit 1
;;
esac`);
}

module.exports = filePreinst;